import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/TaskEither';
import Cookies from 'js-cookie';

export const SessionTokenKey = 'session-token';
export const RefreshTokenKey = 'refresh-token';

export const saveSessionToken = (token: string): void =>
  localStorage.setItem(SessionTokenKey, token);

export const getSessionToken = (): O.Option<string> =>
  O.fromNullable(localStorage.getItem(SessionTokenKey));

export class RefreshCookieError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export const constructSessionHeader = () =>
  pipe(
    getSessionToken(),
    O.map((token) => ({ Authorization: `Bearer ${token}` })),
  );

export const saveRefreshToken = (token: string): TE.TaskEither<RefreshCookieError, string> =>
  TE.fromNullable(new RefreshCookieError('Failed to save refresh token cookie'))(
    Cookies.set(RefreshTokenKey, token),
  );

export const getRefreshToken = (): O.Option<string> => O.fromNullable(Cookies.get(RefreshTokenKey));

export const deleteRefreshToken = (): void => Cookies.remove(RefreshTokenKey);
