import { constructSessionHeader } from './../../util/jwt-utils';
import { ZodDefaultResponse } from './../gloabal-types';
import type { ZodDefaultResponseT } from './../gloabal-types';
import { Config } from './../../config/index';
import { validateSafeT } from './../safe-parse';
import * as TE from 'fp-ts/TaskEither';
import { z } from 'zod';
import { pipe } from 'fp-ts/function';
import axios from 'axios';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(6).max(256);
export const loginSchema = z.object({
  email: emailSchema.trim(),
  password: passwordSchema.trim(),
});

export const LoginResponseSchema = z
  .object({
    data: z.object({
      refreshToken: z.string().min(1).max(1024),
      sessionToken: z.string().min(1).max(1024),
    }),
  })
  .merge(ZodDefaultResponse);

type LoginSchemaT = z.infer<typeof loginSchema>;

export const login = ({
  email,
  password,
}: LoginSchemaT): TE.TaskEither<Error, z.infer<typeof LoginResponseSchema>> =>
  pipe(
    TE.Do,
    TE.bind('data', () => validateSafeT({ email, password }, loginSchema)),
    TE.bind('login', ({ data }) =>
      TE.tryCatch(
        async () =>
          axios.post<z.infer<typeof LoginResponseSchema>>(`${Config.BaseURL}/login`, data),
        (reason) => reason,
      ),
    ),
    TE.bindW('validate', ({ login }) => validateSafeT(login.data, LoginResponseSchema)),
    TE.map(({ validate }) => validate),
    TE.mapLeft((res) => new Error(`Failed to login, got error ${res}`)),
  );

export class InvalidSessionError extends Error {
  public constructor(err: unknown) {
    super(`session was invalid. Got error/value: ${err}`);
  }
}

export const validateSession = () =>
  pipe(
    TE.Do,
    TE.bind('sessionHeader', () =>
      pipe(
        constructSessionHeader(),
        TE.fromOption(() => new InvalidSessionError(undefined)),
      ),
    ),
    TE.bind('sessionValidity', ({ sessionHeader }) =>
      TE.tryCatch(
        async () =>
          await axios.post<ZodDefaultResponseT>(
            `${Config.BaseURL}/validate-session`,
            {},
            {
              headers: { ...sessionHeader },
            },
          ),
        (reason) => new InvalidSessionError(reason),
      ),
    ),
    TE.bind('wasValid', ({ sessionValidity }) =>
      pipe(
        sessionValidity,
        TE.fromPredicate(
          (sessionValidity) => sessionValidity.status === 200,
          () => new InvalidSessionError('Response from server was a no-no'),
        ),
      ),
    ),
    TE.map(() => true),
  );
