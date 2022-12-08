import { InvalidSessionError } from './../auth/index';
import { validateSafeT } from './../safe-parse';
import { pipe } from 'fp-ts/function';
import { UserSchema } from './user-schema';
import * as TE from 'fp-ts/TaskEither';
import axios from 'axios';
import { Config } from '@/config';
import { z } from 'zod';
import { constructSessionHeader } from '@/util/jwt-utils';
import { Lists } from '@/stores/list-store';
import { Do } from 'fp-ts-contrib/lib/Do';

export const User = z.object({
  username: z.string(),
  lists: Lists,
});

const BaseUrl = `${Config.BaseURL}/user`;

export const getAllUsers = () =>
  Do(TE.Monad)
    .bind(
      'sessionHeader',
      pipe(
        constructSessionHeader(),
        TE.fromOption(() => new InvalidSessionError(undefined)),
      ),
    )
    .bindL('getUsers', ({ sessionHeader }) =>
      TE.tryCatch(
        async () =>
          axios.get(`${BaseUrl}/all`, {
            headers: { ...sessionHeader },
          }),
        (reason) => new InvalidSessionError(reason),
      ),
    )
    .bindL('validate', ({ getUsers }) => validateSafeT(getUsers.data, UserSchema))
    .return((res) => res.validate as z.infer<typeof UserSchema>);
