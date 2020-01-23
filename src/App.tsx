import { createMuiTheme, CssBaseline, responsiveFontSizes } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { History } from 'history';
import React, { FC, memo } from 'react';
import { Route, Router, Switch } from 'react-router';
import SignInDialog from './auth/SignInDialog';
import Header from './common/components/Header';
import Layout from './common/components/Layout';
import './core/_bootstrap/app.css';
import { appTheme } from './core/app.theme';
import Home from './home/Home';
import Profile from './profile/Profile';

const muiTheme = responsiveFontSizes(createMuiTheme(appTheme));

interface Props {
  history: History;
}

const App: FC<Props> = ({ history }) => {
  return (
    // Initializes the theme for child components
    <MuiThemeProvider theme={muiTheme}>
      {/* A few CSS defaults provided by Material UI */}
      <CssBaseline />
      {/* Initializes routing for child components */}
      <Router history={history}>
        <>
          {/* Sign in dialog showed when the user is not authenticated */}
          <SignInDialog />
          {/* Header bar */}
          <Header />
          {/* Page content wrapper (except header) to ensure the scrollbar/header are correct */}
          <Layout>
            <Switch>
              {/* List of pages - add new pages here. */}
              <Route exact path="/" component={Home} />
              <Route path="/profile" component={Profile} />
            </Switch>
          </Layout>
        </>
      </Router>
    </MuiThemeProvider>
  );
};

export default memo(App);
