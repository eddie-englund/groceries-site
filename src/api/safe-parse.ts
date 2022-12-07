import type { z, ZodError, ZodTypeAny } from 'zod';
import { tryCatch } from 'fp-ts/TaskEither';
import type { TaskEither } from 'fp-ts/TaskEither';

type zodValidator<T extends z.ZodTypeAny> =
  | z.ZodString
  | z.ZodNumber
  | z.SomeZodObject
  | z.ZodArray<T>;

export type Validated<T> = {
  success: boolean;
  body?: T;
};

export const validateSafeT = <T, U extends ZodTypeAny = z.ZodAny>(
  input: T,
  schema: zodValidator<U>,
): TaskEither<ZodError, T> =>
  tryCatch(
    async () => (await schema.parseAsync(input)) as T,
    (reason) => reason as ZodError,
  );
