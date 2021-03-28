import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import React, { FC, memo } from 'react';

export const SignInButton: FC<{ className?: string }> = memo(props => {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
  } = useAuth0();
  // const handleClick = useCallback(() => logout({
  //   returnTo: window.location.origin,
  //   client_id: auth0ProviderConfig.clientId,
  // }), []);

  if (isAuthenticated) {
    return null;
  }
  // TODO remove loading? Doesn't make sense here?
  console.log('Sign in isLoading:', isLoading);
  return <>
    <Button
      variant="outlined"
      size={'medium'}
      disabled={isLoading}
      startIcon={<VpnKeyIcon />}
      onClick={loginWithRedirect}
      {...props}
    >
      Sign in
    </Button>
  </>;
});
