import { createMuiTheme, CssBaseline, responsiveFontSizes } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { FC, memo } from 'react';
import { Route, Switch } from 'react-router';
import Header from './common/components/Header';
import Layout from './common/components/Layout';
import './core/_bootstrap/app.css';
import { appTheme } from './core/app.theme';
import SignInDialog from './views/auth/SignInDialog';
import Home from './views/home/Home';
import Profile from './views/profile/Profile';

const muiTheme = responsiveFontSizes(createMuiTheme(appTheme));

interface Props {
}

const App: FC<Props> = () => {
  return (
    // Initializes the theme for child components
    <MuiThemeProvider theme={muiTheme}>
      {/* A few CSS defaults provided by Material UI */}
      <CssBaseline />
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
    </MuiThemeProvider>
  );
};

export default memo(App);
