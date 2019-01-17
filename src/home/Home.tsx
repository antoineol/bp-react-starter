import {
  Button,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import logo from './logo.svg';

// An issue with TypeScript prevents CSS properties auto-completion. We can
// hope to have a fix in TypeScript 3.3. Issues to follow up:
// https://github.com/Microsoft/TypeScript/issues/22077
// https://github.com/mui-org/material-ui/issues/11693
// A workaround to have auto-completion is to set CSSProperties type to class values as below.
const styles = ({ palette, spacing }: Theme) => createStyles(
  {
    app: {
      textAlign: 'center',
    } as CSSProperties,
    appLogo: {
      animation: 'App-logo-spin infinite 20s linear',
      height: '40vmin',
    },
    appHeader: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    } as CSSProperties,
    '@keyframes App-logo-spin': {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
}

class Home extends Component<Props> {
  increment = () => {
    console.log('Increment');
  };

  render() {
    const { classes } = this.props;
    const counter = 0;
    // TODO peut-on se passer de la div ?
    // TODO remplacer les dernières occurrences de "app"
    return (
      <div className={classes.app}>
        <header className={classes.appHeader}>
          <img src={logo} className={classes.appLogo} alt="logo" />
          <Typography variant="body1">
            Edit <code>src/home/Home.tsx</code> and save to reload.
          </Typography>
          <Button color={'primary'} href="https://reactjs.org" target="_blank"
                  rel="noopener noreferrer">
            Learn React
          </Button>
          <Button color={'primary'} onClick={this.increment}>
            Increment ({counter})
          </Button>
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
