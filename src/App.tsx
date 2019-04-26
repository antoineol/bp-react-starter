import { createMuiTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { appTheme } from './core/app.theme';
import Home from './home/Home';

const muiTheme = createMuiTheme(appTheme);

export interface Props {
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
            <Route exact path="/" component={Home} />
          </Switch>
        </ConnectedRouter>
      </MuiThemeProvider>
    );
  }
}
