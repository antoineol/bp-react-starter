import { Button } from '@material-ui/core';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import React, { FC, memo, useState } from 'react';
import ErrorComp from '../../common/components/ErrorComp';
import { useAsyncHandler, useCache } from '../../common/utils/app.utils';
import { GET_JWT, signOut } from './auth.service';

const SignOutButton: FC<{ className?: string }> = props => {
  const { jwt } = useCache(GET_JWT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(undefined);
  const handleClick = useAsyncHandler(signOut, setLoading, setError);

  if (!jwt) {
    return null;
  }
  return <>
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
  </>;
};

export default memo(SignOutButton);
