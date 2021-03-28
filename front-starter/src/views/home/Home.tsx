import { Button, CircularProgress, Link, TextField, Typography } from '@material-ui/core';
import React, { FC, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ErrorComp from '../../common/components/ErrorComp';
import { ApiPublicBox } from './components/ApiPublicBox';
import { ApiSecuredBox } from './components/ApiSecuredBox';
import SecretArea from './components/SecretArea';
import {
  changeCount,
  doubleCount,
  incrementAsync,
  selectCount,
  selectCountError,
  selectCountLoading,
} from './count.service2';
import { useHomeStyles } from './home-css';
import logo from './logo.svg';


export const Home: FC = memo(() => {
  const classes = useHomeStyles(); // MUI Styles
  const count = useSelector(selectCount);
  const loading = useSelector(selectCountLoading);
  const error = useSelector(selectCountError);
  const dispatch = useDispatch();
  const handleClick = useCallback(() => dispatch(incrementAsync()), []);
  const handleSubmit = useCallback(e => {
    e.preventDefault();
    dispatch(doubleCount());
  }, []);
  const handleChange = useCallback(e => dispatch(changeCount(Number(e.target.value) || 0)), []);

  return (
    <div className={classes.root}>
      <img src={logo} className={classes.logo} alt="logo" />
      <Typography variant="body1">
        Edit <code>src/home/Home.tsx</code> and save to reload.
      </Typography>
      <Link href='https://reactjs.org' target='_blank' rel='noopener noreferrer'
            color={'primary'}>
        Learn React</Link>
      <form onSubmit={handleSubmit}>
        <TextField
          id={'count'}
          name={'count'}
          label="Count"
          value={isNaN(count) ? '' : count}
          onChange={handleChange}
          type={'number'}
          disabled={loading}
        />
      </form>
      <Button
        variant={'outlined'}
        color={'primary'}
        className={classes.incrButton}
        disabled={loading}
        onClick={handleClick}>
        Fetch n°{isNaN(count) ? '-' : count}
        {loading && <CircularProgress className={classes.loader} size={20} />}
      </Button>
      <ErrorComp error={error} />
      <ApiPublicBox />
      <ApiSecuredBox />
      <SecretArea />
    </div>
  );
});
