import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../common/app.utils';
import { ProfileAT, selectLoadingProfile, selectProfile } from './profile.service';

function Profile() {
  const dispatch = useAppDispatch(); // Redux dispatcher
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectLoadingProfile);
  useEffect(() => {
    dispatch(ProfileAT.Load);
  }, []);

  return <div>Profile: {loading ? 'loading...' : JSON.stringify(profile)}</div>;
}

export default memo(Profile);
