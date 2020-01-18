import { Button } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import gql from 'graphql-tag';
import React, { Fragment, memo, useCallback, useState } from 'react';
import { asyncHandler, useCache } from '../common/app.utils';
import ErrorComp from '../common/components/ErrorComp';
import { signOut } from './auth.service';

const GET_JWT = gql`{ jwt @client }`;

function SignOutButton(props: { className?: string }) {
  const { jwt } = useCache(GET_JWT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(undefined);
  const handleClick = useCallback(asyncHandler(signOut, setLoading, setError), []);

  if (!jwt) {
    return null;
  }
  return <Fragment>
    <Button
      variant="outlined"
      size={'medium'}
      disabled={loading}
      startIcon={<MeetingRoomIcon />}
      onClick={handleClick}
      {...props}
    >
      Sign out
    </Button>
    <ErrorComp error={error} />
  </Fragment>;
}

export default memo(SignOutButton);
