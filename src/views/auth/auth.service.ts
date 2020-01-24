import gql from 'graphql-tag';
import { appConfig } from '../../common/app.config';
import { getGqlClient, resetWsConnection } from '../../common/graphql.client';
import { handleError } from '../../common/services/error.service';
import { deleteCookie, getCookie, writeCache } from '../../common/utils/app.utils';
import { apiPost } from '../../common/utils/http.utils';
import { scheduleJwtRefresh, signInWithGoogle } from './googleSignIn.service';

export const GET_JWT = gql`{ jwt }`;

export function initAuth() {
  const jwt = getCookie(appConfig.jwtCookieName);
  scheduleJwtRefresh(jwt, true);
  writeCache({ jwt });
}

type _PromiseResolver<T> = (value?: T | PromiseLike<T>) => void;

let authResolve: _PromiseResolver<string> | undefined;
let authPromise: Promise<string> | undefined;

/**
 * Called by anything in the app that requires authentication (user action, loading a secured
 * page...).
 * @return Promise resolved with JWT once the authentication is completed.
 */
export async function showSignIn(): Promise<string> {
  if (!authPromise) {
    // Triggering the sign out will remove JWT from cache and show the sign in dialog.
    signOut().catch(err => handleError(err));
    // This promise will be resolved separately at the end of the dialog sign in steps
    // (dialogSignIn).
    authPromise = new Promise<string>(resolve => {
      authResolve = resolve;
    });
  }
  return authPromise;
}

/**
 * Called by sign in dialog to start the authentication. Side effect: once authentication is
 * completed successfully, the authentication initial promise is resolved.
 * @return a promise resolved with jwt at the end of sign in.
 */
export async function dialogSignIn(): Promise<string> {
  const jwt = await signInWithGoogle();
  writeCache({ jwt });
  resetWsConnection();
  if (authResolve) {
    authResolve(jwt);
  }
  authResolve = undefined;
  authPromise = undefined;
  return jwt;
}

export async function signOut(): Promise<void> {
  try {
    await remoteSignOut();
  } catch (e) {
  }
  await localSignOut();
}

/**
 * Guarantees that a valid JWT is added to the headers by eventually requiring a user
 * authentication first.
 * @param headers
 */
export async function addJwtToHeaders(headers: any): Promise<any> {
  const jwt = await getJwt();
  // return the headers to the context so httpLink can read them
  return !jwt ? headers : {
    ...headers,
    authorization: `Bearer ${jwt}`,
  };
}

async function getJwt(): Promise<string> {
  const jwt = getLocalJwt();
  if (jwt) {
    return jwt;
  }
  return showSignIn();
}

function getLocalJwt(): string | undefined {
  const jwt1 = getCookie(appConfig.jwtCookieName);
  const jwt2 = getCookie(appConfig.jwtSignatureCookieName);
  return jwt1 && jwt2 ? `${jwt1}.${jwt2}` : undefined;
}

function remoteSignOut(): Promise<void> {
  return apiPost('/auth/signout');
}

export async function localSignOut() {
  deleteCookie(appConfig.jwtCookieName);
  deleteCookie(appConfig.jwtSignatureCookieName);
  resetWsConnection();
  const gqlClient = getGqlClient();
  await gqlClient.resetStore(); // Reset the store, including empty JWT.
}
