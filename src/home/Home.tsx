import {
  Button,
  CircularProgress,
  createStyles,
  Link,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../common/app.utils';
import { useFeatures } from '../common/services/features.service';
import { CountAT, selectCount, selectIncrementLoading } from './count.service';
import logo from './logo.svg';
import SecretArea from './secret/SecretArea';

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } as CSSProperties,
  logo: {
    animation: 'Home-logo-spin infinite 20s linear',
    height: '40vmin',
  },
  incrButton: {
    marginTop: '1rem',
  },
  loader: {
    marginLeft: '0.5rem',
  },
  '@keyframes Home-logo-spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}));

// Component

function HomeComp() {
  const classes = useStyles(); // MUI Styles
  const count = useSelector(selectCount); // Redux Selectors
  const loading = useSelector(selectIncrementLoading);
  const features = useFeatures();
  const dispatch = useAppDispatch(); // Redux dispatcher
  // Callbacks optimized to keep the same reference to avoid re-rendering child components
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(CountAT.DoubleCount);
  }, [dispatch]);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(CountAT.UpdateCount, parseFloat(e.target.value));
  }, [dispatch]);
  const handleClick = useCallback(() => dispatch(CountAT.Increment), [dispatch]);

  return (
    <div className={classes.root}>
      <img src={logo} className={classes.logo} alt="logo" />
      <Typography variant="body1">
        Edit <code>src/home/Home.tsx</code> and save to reload.
      </Typography>
      <Link href='https://reactjs.org' target='_blank' rel='noopener noreferrer' color={'primary'}>
        Learn React</Link>
      <form onSubmit={handleSubmit}>
        <TextField
          id={'count'}
          name={'count'}
          label="Count"
          value={isNaN(count) ? '' : count}
          onChange={handleChange}
          type={'number'}
        />
      </form>
      {features.get('queryJsonPlaceholder') && <Button
        variant={'outlined'}
        color={'primary'}
        className={classes.incrButton}
        disabled={loading}
        onClick={handleClick}>
        Fetch n°{isNaN(count) ? '-' : count}
        {loading && <CircularProgress className={classes.loader} />}
      </Button>}
      <SecretArea />
    </div>
  );
}

export default memo(HomeComp);
