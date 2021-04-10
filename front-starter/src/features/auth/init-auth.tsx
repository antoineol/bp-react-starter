import { Auth0Provider, Auth0ProviderOptions, useAuth0 } from '@auth0/auth0-react';
import React, { FC, memo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import ErrorComp from '../../common/components/ErrorComp';
import { handleError } from '../../common/services/error.service';
import { env } from '../../environment/env';

export const InitAuth0Provider: FC = memo(({ children }) => {
  let history = useHistory();
  return <Auth0Provider {...getAuth0ProviderConfig(history)}>
    {children}
  </Auth0Provider>;
});

export const Auth0ErrorHandler: FC = memo(() => {
  const { error } = useAuth0();
  const errRef = useRef<Error>();
  if (errRef.current !== error) {
    if (error) {
      handleError(error);
    }
    errRef.current = error;
  }
  return error ? <ErrorComp error={error} /> : null;
});

// Please see https://auth0.github.io/auth0-react/interfaces/auth0provideroptions.html
// for a full list of the available properties on the provider
function getAuth0ProviderConfig(history: ReturnType<typeof useHistory>): Auth0ProviderOptions {
  return {
    domain: env.auth0Domain,
    clientId: env.auth0ClientId,
    audience: env.auth0Audience,
    redirectUri: window.location.origin,
    onRedirectCallback: (appState) => {
      // console.log('appState?.returnTo:', appState?.returnTo);
      // console.log('window.location.pathname:', window.location.pathname);
      // window.location.replace(window.location.pathname);
      history.replace(
        appState && appState.returnTo ? appState.returnTo : window.location.pathname,
      );
    },
  };
}
