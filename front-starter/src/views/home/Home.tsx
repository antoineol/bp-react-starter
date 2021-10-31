import { CircularProgress, Link, TextField, Typography } from '@mui/material';
import React, { FC, memo, useCallback } from 'react';
import ErrorComp from '../../common/components/ErrorComp';
import { useAppDispatch, useAppSelector } from '../../core/redux/hooks';
import { ApiPublicBox } from './components/ApiPublicBox';
import { ApiSecuredBox } from './components/ApiSecuredBox';
import { SecretArea } from './components/SecretArea';
import {
  changeCount,
  doubleCount,
  incrementAsync,
  selectCount,
  selectCountError,
  selectCountLoading,
} from './count.service';
import { IncrButton, LogoImg, PageWrapper } from './home-css';
import logo from './logo.svg';

export const Home: FC = memo(() => {
  const count = useAppSelector(selectCount);
  const loading = useAppSelector(selectCountLoading);
  const error = useAppSelector(selectCountError);
  const dispatch = useAppDispatch();
  const handleClick = useCallback(() => dispatch(incrementAsync()), [dispatch]);
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(doubleCount());
    },
    [dispatch],
  );
  const handleChange = useCallback(
    e => dispatch(changeCount(Number(e.target.value) || 0)),
    [dispatch],
  );

  return (
    <PageWrapper>
      <LogoImg src={logo} alt='logo' />
      <Typography variant='body1'>
        Home page that does not require any authentication. Sign in (or sign up)
        to get access to private sections.
      </Typography>
      <Link
        href='https://reactjs.org'
        target='_blank'
        rel='noopener noreferrer'
        color={'primary'}
        underline='hover'
      >
        Learn React
      </Link>
      <form onSubmit={handleSubmit}>
        <TextField
          id={'count'}
          name={'count'}
          label='Count'
          value={isNaN(count) ? '' : count}
          onChange={handleChange}
          type={'number'}
          disabled={loading}
        />
      </form>
      <IncrButton disabled={loading} onClick={handleClick}>
        Fetch n°{isNaN(count) ? '-' : count}
        {loading && <CircularProgress size={20} />}
      </IncrButton>
      <ErrorComp error={error} />
      <ApiPublicBox />
      <ApiSecuredBox />
      <SecretArea />
    </PageWrapper>
  );
});
