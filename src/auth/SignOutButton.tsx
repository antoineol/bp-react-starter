import { Button } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import React, { Fragment, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../common/app.utils';
import ErrorComp from '../common/components/ErrorComp';
import { AuthAT, selectAuthError, selectAuthLoading, selectIsLoggedIn } from './auth.service';

function SignOutButton(props: { className?: string }) {
  const isSignedIn = useSelector(selectIsLoggedIn);
  const loading = useSelector(selectAuthLoading); // Redux Selectors
  const error = useSelector(selectAuthError);
  const dispatch = useAppDispatch(); // Redux dispatcher
  // Callback optimized to keep the same reference to avoid re-rendering child components
  const signOut = useCallback(() => dispatch(AuthAT.SignOut), [dispatch]);

  if (!isSignedIn) {
    return null;
  }
  return <Fragment>
    <Button
      variant="outlined"
      size={'medium'}
      disabled={loading}
      startIcon={<MeetingRoomIcon />}
      onClick={signOut}
      {...props}
    >
      Sign out
    </Button>
    <ErrorComp error={error} />
  </Fragment>;
}

export default memo(SignOutButton);
