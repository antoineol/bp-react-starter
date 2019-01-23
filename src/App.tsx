import { createMuiTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { appTheme } from './_core/app.theme';
import ConnectedHome from './home/ConnectedHome';

const muiTheme = createMuiTheme(appTheme);

interface Props {
  history: History;
}

export default class App extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" component={ConnectedHome} />
          </Switch>
        </ConnectedRouter>
      </MuiThemeProvider>
    );
  }
}
