import { createMuiTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { createBrowserHistory, History } from 'history';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { configureStore } from './_core/app.store';
import { appTheme } from './_core/app.theme';
import { AppStoreDirectModel } from './common/app.models';
import ConnectedHome from './home/ConnectedHome';

// App creation is in a function so that we can reuse it in integration tests
export function makeApp(AppComp = App, initialStore: Partial<AppStoreDirectModel> = {}) {
  const history: History = createBrowserHistory();
  const store = configureStore(initialStore, history);
  const app = <Provider store={store}>
    <AppComp history={history} />
  </Provider>;
  return { app, history, store };
}

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
            <Route exact path="/" component={ConnectedHome} />
          </Switch>
        </ConnectedRouter>
      </MuiThemeProvider>
    );
  }
}
