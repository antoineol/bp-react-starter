import { CircularProgress } from '@mui/material';
import React, { FC, memo, useCallback } from 'react';
import ErrorComp from '../../../common/components/ErrorComp';
import { useAppDispatch, useAppSelector } from '../../../core/redux/hooks';
import {
  fetchSecured,
  selectSecured,
  selectSecuredError,
  selectSecuredLoading,
} from '../api.redux';
import { IncrButton } from '../home-css';

export const ApiSecuredBox: FC = memo(() => {
  const secured = useAppSelector(selectSecured);
  const securedLoading = useAppSelector(selectSecuredLoading);
  const securedError = useAppSelector(selectSecuredError);
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => dispatch(fetchSecured()), [dispatch]);

  return (
    <>
      <IncrButton disabled={securedLoading} onClick={handleClick}>
        Fetch API secured route
        {securedLoading && <CircularProgress size={20} />}
      </IncrButton>
      {secured != null &&
        (secured ? (
          <>API secured route fetched successfully.</>
        ) : (
          <>API secured route... not secured? To investigate.</>
        ))}
      <ErrorComp error={securedError} />
    </>
  );
});
