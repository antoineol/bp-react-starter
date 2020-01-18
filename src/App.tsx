import { createMuiTheme, CssBaseline, responsiveFontSizes } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import React, { Fragment, memo } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Route, Switch } from 'react-router';
import { initAuth } from './auth/auth.service';
import SignInDialog from './auth/SignInDialog';
import Header from './common/components/Header';
import { getGqlClient } from './common/graphql.client';
import { appTheme } from './core/app.theme';
import Home from './home/Home';
import Profile from './profile/Profile';

const muiTheme = responsiveFontSizes(createMuiTheme(appTheme));
const gqlClient = getGqlClient();
initAuth();

export interface Props {
  history: History;
}

function App({ history }: Props) {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ApolloProvider client={gqlClient}>
        <ConnectedRouter history={history}>
          <Fragment>
            <SignInDialog />
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/profile" component={Profile} />
            </Switch>
          </Fragment>
        </ConnectedRouter>
      </ApolloProvider>
    </MuiThemeProvider>
  );
}

export default memo(App);
