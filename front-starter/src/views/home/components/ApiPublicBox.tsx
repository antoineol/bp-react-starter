import { CircularProgress } from '@mui/material';
import React, { FC, memo, useCallback } from 'react';
import ErrorComp from '../../../common/components/ErrorComp';
import { useAppDispatch, useAppSelector } from '../../../core/redux/hooks';
import {
  fetchIsAlive,
  selectIsAlive,
  selectIsAliveError,
  selectIsAliveLoading,
} from '../api.redux';
import { IncrButton } from '../home-css';

export const ApiPublicBox: FC = memo(() => {
  const isAlive = useAppSelector(selectIsAlive);
  const isAliveLoading = useAppSelector(selectIsAliveLoading);
  const isAliveError = useAppSelector(selectIsAliveError);
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => dispatch(fetchIsAlive()), [dispatch]);

  return (
    <>
      <IncrButton disabled={isAliveLoading} onClick={handleClick}>
        Fetch API public route
        {isAliveLoading && <CircularProgress size={20} />}
      </IncrButton>
      {isAlive != null &&
        (isAlive ? <>API is alive.</> : <>API is not alive.</>)}
      <ErrorComp error={isAliveError} />
    </>
  );
});
