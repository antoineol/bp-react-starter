import { useAuth0 } from '@auth0/auth0-react';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { Button } from '@mui/material';
import React, { FC, memo, useCallback } from 'react';
import { env } from '../../environment/env';

export const SignOutButton: FC<{ className?: string }> = memo(props => {
  const { isLoading, isAuthenticated, logout } = useAuth0();
  const handleClick = useCallback(
    () =>
      logout({
        returnTo: window.location.origin,
        client_id: env.auth0ClientId,
      }),
    [logout],
  );

  if (!isAuthenticated) {
    return null;
  }
  // TODO remove loading? Doesn't make sense here?
  return (
    <>
      <Button
        variant='outlined'
        size={'medium'}
        disabled={isLoading}
        startIcon={<MeetingRoomIcon />}
        onClick={handleClick}
        {...props}
      >
        Sign out
      </Button>
    </>
  );
});
