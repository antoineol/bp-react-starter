import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import React, { FC, memo, useCallback } from 'react';
import { env } from '../../environment/env';

export const SignOutButton: FC<{ className?: string }> = memo(props => {
  const {
    isLoading,
    isAuthenticated,
    logout,
  } = useAuth0();
  const handleClick = useCallback(() => logout({
    returnTo: window.location.origin,
    client_id: env.auth0ClientId,
  }), []);

  if (!isAuthenticated) {
    return null;
  }
  // TODO remove loading? Doesn't make sense here?
  console.log('Sign out isLoading:', isLoading);
  return <>
    <Button
      variant="outlined"
      size={'medium'}
      disabled={isLoading}
      startIcon={<MeetingRoomIcon />}
      onClick={handleClick}
      {...props}
    >
      Sign out
    </Button>
  </>;
});
