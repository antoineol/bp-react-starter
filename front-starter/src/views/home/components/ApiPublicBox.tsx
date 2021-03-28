import { Button, CircularProgress } from '@material-ui/core';
import React, { FC, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComp from '../../../common/components/ErrorComp';
import { fetchPublic, selectIsAlive, selectIsAliveError, selectIsAliveLoading } from '../api.redux';
import { useHomeStyles } from '../home-css';

export const ApiPublicBox: FC = memo(() => {
  const classes = useHomeStyles(); // MUI Styles
  const isAlive = useSelector(selectIsAlive);
  const isAliveLoading = useSelector(selectIsAliveLoading);
  const isAliveError = useSelector(selectIsAliveError);
  const dispatch = useDispatch();
  const handleClick = useCallback(() => dispatch(fetchPublic()), []);

  return <>
    <Button
      variant={'outlined'}
      color={'primary'}
      className={classes.incrButton}
      disabled={isAliveLoading}
      onClick={handleClick}>
      Fetch API public route
      {isAliveLoading && <CircularProgress className={classes.loader} size={20} />}
    </Button>
    {isAlive != null && (
      isAlive ? <>API is alive.</> : <>API is not alive.</>
    )}
    <ErrorComp error={isAliveError} />
  </>;
});
