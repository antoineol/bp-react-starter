import {
  Button,
  CircularProgress,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { Component, ReactNode } from 'react';
import { Counter } from './home.service';
import logo from './logo.svg';

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const styles = ({ palette, spacing }: Theme) => createStyles(
  {
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
  });

interface Props extends WithStyles<typeof styles> {
  increment: () => void;
  count: Counter;
  loading?: boolean;
}

class Home extends Component<Props> {
  render(): ReactNode {
    const { classes, count, loading, increment } = this.props;
    return (
      <div className={classes.root}>
        <img src={logo} className={classes.logo} alt="logo" />
        <Typography variant="body1">
          Edit <code>src/home/Home.tsx</code> and save to reload.
        </Typography>
        {/* TODO we should use the Link MUI component as soon as there is no
          typing issue with href. Then remove useless Button theme customization
          in src/_core/app.theme.ts */}
        <Button color={'primary'} href="https://reactjs.org" target="_blank"
                rel="noopener noreferrer">
          Learn React
        </Button>
        <Button variant={'outlined'}
                color={'primary'}
                className={classes.incrButton}
                disabled={loading}
                onClick={increment}>
          Increment ({count.count})
          {loading && <CircularProgress className={classes.loader} />}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
