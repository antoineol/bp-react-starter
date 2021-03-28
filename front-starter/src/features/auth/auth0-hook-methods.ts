import { useAuth0 } from '@auth0/auth0-react';
import { FC, memo, useEffect } from 'react';

// Not clean, but it's the best I have found to
// - centralise the code responsible for auth, token refresh, retry... when fetching an API
// - allow to fetch the API outside a component, e.g. in a redux thunk (or ideally in any
// independent function)

// TODO approach 1 (could be simplified by exporting a single object and leverage spread
//  operator `...`)

export let getAccessTokenSilently: ReturnType<typeof useAuth0>['getAccessTokenSilently'] = undefined as any;
export let getAccessTokenWithPopup: ReturnType<typeof useAuth0>['getAccessTokenWithPopup'] = undefined as any;
export let getIdTokenClaims: ReturnType<typeof useAuth0>['getIdTokenClaims'] = undefined as any;
export let loginWithRedirect: ReturnType<typeof useAuth0>['loginWithRedirect'] = undefined as any;
export let loginWithPopup: ReturnType<typeof useAuth0>['loginWithPopup'] = undefined as any;
export let logout: ReturnType<typeof useAuth0>['logout'] = undefined as any;
export let buildAuthorizeUrl: ReturnType<typeof useAuth0>['buildAuthorizeUrl'] = undefined as any;
export let buildLogoutUrl: ReturnType<typeof useAuth0>['buildLogoutUrl'] = undefined as any;

export const Auth0SetMethods: FC = memo(() => {
  const {
    getAccessTokenSilently: _getAccessTokenSilently,
    getAccessTokenWithPopup: _getAccessTokenWithPopup,
    getIdTokenClaims: _getIdTokenClaims,
    loginWithRedirect: _loginWithRedirect,
    loginWithPopup: _loginWithPopup,
    logout: _logout,
    buildAuthorizeUrl: _buildAuthorizeUrl,
    buildLogoutUrl: _buildLogoutUrl,
  } = useAuth0();

  getAccessTokenSilently = _getAccessTokenSilently;
  getAccessTokenWithPopup = _getAccessTokenWithPopup;
  getIdTokenClaims = _getIdTokenClaims;
  loginWithRedirect = _loginWithRedirect;
  loginWithPopup = _loginWithPopup;
  logout = _logout;
  buildAuthorizeUrl = _buildAuthorizeUrl;
  buildLogoutUrl = _buildLogoutUrl;

  return null;
});


// TODO approach 2 (preferred?) store token in redux store, watch 401 or token update requests when
//  httpReq catches a 401, refresh the token, store in DB and retry. Catch errors indicating
//  claims are not sufficient (err.error === 'consent_required', require to use a popup to accept
//  the new scope) and when a new complete login is required (err.error === 'login_required').

export const Auth0WatchToken: FC = memo(() => {
  const {
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    watchToken(isAuthenticated, getAccessTokenSilently);
  }, [isAuthenticated]);

  return null;
});

async function watchToken(
  isAuthenticated: boolean,
  getAccessTokenSilently: ReturnType<typeof useAuth0>['getAccessTokenSilently'],
) {
  if (isAuthenticated) {
    try {
      const token = await getAccessTokenSilently();
      console.log('[watchToken] token:', token);
    } catch (e) {
      console.error(e);
      console.error(e.error);
    }
  } else {
    console.log('[watchToken] Not authenticated');
  }

}
