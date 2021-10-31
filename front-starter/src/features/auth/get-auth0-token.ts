import { useAuth0 } from '@auth0/auth0-react';
import { FC, memo } from 'react';

// Not a top clean solution, but it's the best I have found to:
// - centralise the code responsible for auth, token refresh, retry... when fetching an API
// - allow to fetch the API outside a component, e.g. in any independent function
// - Follow best practices to avoid storing the JWT in unsafe place and let Auth0 SDK handle it

let tokenPromise: Promise<string> | undefined;

export async function getToken(force = false) {
  // Wrapper with local state to cover the case when getToken is called twice concurrently. We
  // don't want to run 2 requests to Auth0. Only one request should be sent and the 2 requesters
  // will get the same token.
  // console.log('Get a token'/*, new Error().stack*/);
  try {
    if (tokenPromise) return tokenPromise;
    tokenPromise = _getToken(force);
    const res = await tokenPromise;
    tokenPromise = undefined;
    return res;
  } catch (e) {
    tokenPromise = undefined;
    throw e;
  }
}

async function _getToken(force = false) {
  if (!getAccessTokenSilently) throw new Error('[getToken] getAccessTokenSilently undefined');
  if (!getAccessTokenWithPopup) throw new Error('[getToken] getAccessTokenWithPopup undefined');
  if (!loginWithPopup) throw new Error('[getToken] loginWithPopup undefined');

  try {
    return await getAccessTokenSilently({ ignoreCache: force });
  } catch (e: any) {
    if (e?.error === 'consent_required') {
      return await getAccessTokenWithPopup();
    } else if (e?.error === 'login_required') {
      await loginWithPopup();
      return await getAccessTokenSilently();
    }
    throw e;
  }
}

let getAccessTokenSilently: ReturnType<typeof useAuth0>['getAccessTokenSilently'] | undefined;
let getAccessTokenWithPopup: ReturnType<typeof useAuth0>['getAccessTokenWithPopup'] | undefined;
let loginWithPopup: ReturnType<typeof useAuth0>['loginWithPopup'] | undefined;
// let getIdTokenClaims: ReturnType<typeof useAuth0>['getIdTokenClaims'] | undefined;
// let loginWithRedirect: ReturnType<typeof useAuth0>['loginWithRedirect'] | undefined;
// let logout: ReturnType<typeof useAuth0>['logout'] | undefined;
// let buildAuthorizeUrl: ReturnType<typeof useAuth0>['buildAuthorizeUrl'] | undefined;
// let buildLogoutUrl: ReturnType<typeof useAuth0>['buildLogoutUrl'] | undefined;

export const Auth0SetMethods: FC = memo(() => {
  const {
    getAccessTokenSilently: _getAccessTokenSilently,
    getAccessTokenWithPopup: _getAccessTokenWithPopup,
    loginWithPopup: _loginWithPopup,
    // getIdTokenClaims: _getIdTokenClaims,
    // loginWithRedirect: _loginWithRedirect,
    // logout: _logout,
    // buildAuthorizeUrl: _buildAuthorizeUrl,
    // buildLogoutUrl: _buildLogoutUrl,
  } = useAuth0();

  getAccessTokenSilently = _getAccessTokenSilently;
  getAccessTokenWithPopup = _getAccessTokenWithPopup;
  loginWithPopup = _loginWithPopup;
  // getIdTokenClaims = _getIdTokenClaims;
  // loginWithRedirect = _loginWithRedirect;
  // logout = _logout;
  // buildAuthorizeUrl = _buildAuthorizeUrl;
  // buildLogoutUrl = _buildLogoutUrl;

  return null;
});
