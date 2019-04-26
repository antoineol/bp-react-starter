import {
  Button,
  CircularProgress,
  createStyles,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { AppStore } from '../common/app.models';
import {
  CountActionTypes,
  CounterModel,
  dispatchCount,
  DoubleCountAction,
  IncrementAction,
  selectCount,
  selectIncrementLoading,
  UpdateAction,
} from './count.service';
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

// Redux bindings

type Selection = CounterModel;

const mapStateToProps = createStructuredSelector<AppStore, Selection>(
  {
    count: selectCount(),
    loading: selectIncrementLoading(),
  });
const mapDispatchToProps = {
  dispatch: dispatchCount,
};
type Dispatcher = typeof mapDispatchToProps;

// Props and State definition

export interface Props extends WithStyles<typeof styles>, Selection, Dispatcher {
}

export interface State {
}

// Component

export class HomeComp extends Component<Props, State> {
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.dispatch({ type: CountActionTypes.DoubleCount } as DoubleCountAction);
  };

  handleChange = (name: keyof Props) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // name argument: in case we need to know it in the service
    this.props.dispatch(
      {
        type: CountActionTypes.UpdateCount,
        count: parseFloat(event.target.value),
      } as UpdateAction);
  };

  render(): ReactNode {
    const { classes, count, loading, dispatch } = this.props;
    const c = count.count;
    return (
      <div className={classes.root}>
        <img src={logo} className={classes.logo} alt="logo" />
        <Typography variant="body1">
          Edit <code>src/home/Home.tsx</code> and save to reload.
        </Typography>
        <form onSubmit={this.handleSubmit}>
          <TextField
            label="Count"
            value={isNaN(c) ? '' : c}
            onChange={this.handleChange('count')}
            type={'number'}
          />
        </form>
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
                onClick={() => dispatch({ type: CountActionTypes.Increment } as IncrementAction)}>
          Fetch n°{isNaN(c) ? '-' : c}
          {loading && <CircularProgress className={classes.loader} />}
        </Button>
      </div>
    );
  }
}

// TODO find the syntax with compose() that don't throw TS errors in App.tsx
// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   withStyles(styles),
// )(Home);
// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Home));
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomeComp));
