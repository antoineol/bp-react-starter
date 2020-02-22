import gql from 'graphql-tag';
import jwtDecode from 'jwt-decode';
import { appConfig } from '../../common/app.config';
import { getGqlClient, resetWsConnection } from '../../common/graphql.client';
import { handleError } from '../../common/services/error.service';
import { deleteCookie, getCookie, writeCache } from '../../common/utils/app.utils';
import { apiPost } from '../../common/utils/http.utils';
import { GoogleAuthResponse, JwtClaims, JwtFields, TokenDto } from './auth.model';

export const GET_JWT = gql`{ jwt }`;

// Finalize authentication & JWT initialization

export async function fetchJwtFromGoogleToken(resp: GoogleAuthResponse) {
  const { jwt } = await apiPost<{ jwt: string }>('/auth/create-jwt', { token: resp.tokenId });
  setLocalJwt(jwt);
  addJwtToCacheAndScheduleRefresh(jwt);
  resetWsConnection();
  resolveNewJwt(jwt);
}

export function addJwtToCacheAndScheduleRefresh(jwt: string | null = getLocalJwt(),
                                                allowCallTwice = false) {
  if (jwt) {
    const decoded: TokenDto = jwtDecode(jwt);
    const profile: JwtClaims = decoded[JwtFields.jwtNamespace];
    writeCache({ profile, jwt });
  }
  scheduleJwtRefresh(jwt, allowCallTwice);
}

// Include JWT in HTTP and GraphQL headers

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

// Get JWT, potentially with re-authentication

async function getJwt(): Promise<string> {
  const jwt = getLocalJwt();
  if (jwt) {
    return jwt;
  }
  return fetchNewJwt();
}

type _PromiseResolver<T> = (value?: T | PromiseLike<T>) => void;

let jwtResolver: _PromiseResolver<string> | undefined;
let _authPromise: Promise<string> | undefined;

/**
 * Called by anything in the app that requires authentication (user action, loading a secured
 * page...).
 * @return Promise resolved with JWT once the authentication is completed.
 */
export async function fetchNewJwt(): Promise<string> {
  if (!_authPromise) {
    // Triggering the sign out will remove JWT from cache and show the sign in dialog.
    silentSignOut().catch(err => handleError(err));
    // This promise will be resolved separately at the end of the dialog sign in steps
    // (dialogSignIn).
    _authPromise = new Promise<string>(resolve => {
      jwtResolver = resolve;
    });
  }
  return _authPromise;
}

function resolveNewJwt(jwt: string) {
  if (jwtResolver) {
    jwtResolver(jwt);
  }
  jwtResolver = undefined;
  _authPromise = undefined;
}

// Sign out

export async function signOut(): Promise<void> {
  await silentSignOut();
  const gqlClient = getGqlClient();
  gqlClient.resetStore().catch(handleError); // Reset the store, including empty JWT.
}

export async function silentSignOut(): Promise<void> {
  try {
    await remoteSignOut();
  } catch (e) {
  }
  await localSignOut();
}

function remoteSignOut(): Promise<void> {
  return apiPost('/auth/signout');
}

function localSignOut() {
  clearLocalJwt();

  resetWsConnection();
}

// JWT refresh

let refreshTimer: NodeJS.Timeout | null = null;
let prevRefreshTime: number;

function scheduleJwtRefresh(jwt: string | null, allowCallTwice = false) {
  // If handling error is simpler, we could make it return a promise rejected if any error
  // interrupting the process happens, instead of handling error here.
  if (!jwt) {
    return;
  }
  const decoded: TokenDto = jwtDecode(jwt);
  const claims = (JwtFields.jwtNamespace ? decoded[JwtFields.jwtNamespace] : decoded) as JwtClaims;
  if (!claims.refresh) {
    throw new Error(`No refresh date found`);
  }
  const date = new Date(claims.refresh);
  const time = date.getTime();
  if (!allowCallTwice && time === prevRefreshTime) {
    throw new Error(`Refresh time was not updated. Old: ${new Date(
      prevRefreshTime).toISOString()}, new: ${date.toISOString()}`);
  }
  prevRefreshTime = time;
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  let renewInMs = time - new Date().getTime();
  if (renewInMs < 0) {
    renewInMs = 0;
  }
  refreshTimer = setTimeout(refreshJwt, renewInMs);
}

async function refreshJwt() {
  try {
    const { jwt } = await apiPost('/auth/refresh');
    setLocalJwt(jwt);
    addJwtToCacheAndScheduleRefresh(jwt);
  } catch (e) {
    handleError(e);
    fetchNewJwt().catch(handleError);
  }
}

// JWT utilities

export function getLocalJwt(): string | null {
  if (appConfig.useLocalStorageJwt) {
    return localStorage.getItem(`${appConfig.appName}_jwt`);
  }
  const jwt1 = getCookie(appConfig.jwtCookieName);
  const jwt2 = getCookie(appConfig.jwtSignatureCookieName);
  return jwt1 && jwt2 ? `${jwt1}.${jwt2}` : null;
}

export function setLocalJwt(jwt: string) {
  if (appConfig.useLocalStorageJwt) {
    localStorage.setItem(`${appConfig.appName}_jwt`, jwt);
  }
  // If cookie instead of local storage, it is automatically set by the API response.
}

export function clearLocalJwt() {
  deleteCookie(appConfig.jwtCookieName);
  deleteCookie(appConfig.jwtSignatureCookieName);
  localStorage.removeItem(`${appConfig.appName}_jwt`);
  writeCache({ profile: null, jwt: null });
}
