import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme, CssBaseline, responsiveFontSizes } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { FC, memo } from 'react';
import { Route, Switch } from 'react-router';
import { Header } from './common/components/Header';
import { Layout } from './common/components/Layout';
import './core/_bootstrap/app.css';
import { appTheme } from './core/app.theme';
import { Auth0ErrorHandler } from './features/auth/init-auth';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { InitApolloProvider } from './features/hasura/init-hasura';
import { Home } from './views/home/Home';
import { Profile } from './views/profile/Profile';


const muiTheme = responsiveFontSizes(createMuiTheme(appTheme));

interface Props {
}

export const App: FC<Props> = memo(() => {
  return (
    // Initializes the theme for child components
    <MuiThemeProvider theme={muiTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {/* A few CSS defaults provided by Material UI */}
        <CssBaseline />
        <Auth0ErrorHandler />
        {/* Initializes Apollo GraphQL client for child components */}
        <InitApolloProvider>
          {/* Header bar */}
          <Header />
          {/* Page content wrapper (except header) to ensure the scrollbar/header are correct */}
          <Layout>
            <Switch>
              {/* List of pages - add new pages here. */}
              <Route exact path="/" component={Home} />
              <ProtectedRoute path="/profile" component={Profile} />
            </Switch>
          </Layout>
        </InitApolloProvider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
});
