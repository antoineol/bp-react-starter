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
import React, { FC, memo, useCallback, useState } from 'react';
import ErrorComp from '../common/components/ErrorComp';
import { GET_JSON_PL } from '../common/services/features.service';
import { useAsyncHandler, useCache } from '../common/utils/app.utils';
import { changeCount, doubleCount, GET_COUNT, incrementCount } from './count.service';
import logo from './logo.svg';
import SecretArea from './secret/SecretArea';

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flex: 1,
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

const Home: FC = () => {
  const classes = useStyles(); // MUI Styles
  const { home: { count } } = useCache(GET_COUNT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(undefined);
  const handleClick = useAsyncHandler(incrementCount, setLoading, setError);
  const handleSubmit = doubleCount;
  // Callback optimized to keep the same reference to avoid re-rendering child components
  const handleChange = useCallback(e => changeCount(e, parseFloat(e.target.value)), []);
  const { features: { queryJsonPlaceholder } } = useCache(GET_JSON_PL);

  return (
    <div className={classes.root}>
      <img src={logo} className={classes.logo} alt="logo" />
      <Typography variant="body1">
        Edit2 <code>src/home/Home.tsx</code> and save to reload.
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
          disabled={loading}
        />
      </form>
      {queryJsonPlaceholder && <Button
        variant={'outlined'}
        color={'primary'}
        className={classes.incrButton}
        disabled={loading}
        onClick={handleClick}>
        Fetch n°{isNaN(count) ? '-' : count}
        {loading && <CircularProgress className={classes.loader} />}
      </Button>}
      <ErrorComp error={error} />
      <SecretArea />
    </div>
  );
};

export default memo(Home);
