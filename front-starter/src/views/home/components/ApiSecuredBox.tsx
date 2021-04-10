import { Button, CircularProgress } from '@material-ui/core';
import React, { FC, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComp from '../../../common/components/ErrorComp';
import {
  fetchSecured,
  selectSecured,
  selectSecuredError,
  selectSecuredLoading,
} from '../api.redux';
import { useHomeStyles } from '../home-css';

export const ApiSecuredBox: FC = memo(() => {
  const classes = useHomeStyles(); // MUI Styles
  const secured = useSelector(selectSecured);
  const securedLoading = useSelector(selectSecuredLoading);
  const securedError = useSelector(selectSecuredError);
  const dispatch = useDispatch();
  const handleClick = useCallback(() => dispatch(fetchSecured()), [dispatch]);

  return <>
    <Button
      variant={'outlined'}
      color={'primary'}
      className={classes.incrButton}
      disabled={securedLoading}
      onClick={handleClick}>
      Fetch API secured route
      {securedLoading && <CircularProgress className={classes.loader} size={20} />}
    </Button>
    {secured != null && (
      secured
        ? <>API secured route fetched successfully.</>
        : <>API secured route... not secured? To investigate.</>
    )}
    <ErrorComp error={securedError} />
  </>;
});
