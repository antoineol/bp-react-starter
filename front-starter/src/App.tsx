import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import React, { FC, memo } from 'react';
import { Route, Switch } from 'react-router';
import { Header } from './common/components/Header';
import { Layout } from './common/components/Layout';
import './core/_bootstrap/app.css';
import { muiTheme } from './core/app.theme';
import { Auth0ErrorHandler } from './features/auth/init-auth';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { InitApolloProvider } from './features/hasura/init-hasura';
import { Home } from './views/home/Home';
import { Profile } from './views/profile/Profile';

export const App: FC = memo(() => {
  return (
    <StyledEngineProvider injectFirst>
      {/*// Initializes the theme for child components*/}
      <ThemeProvider theme={muiTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <Route exact path='/' component={Home} />
                <ProtectedRoute path='/profile' component={Profile} />
              </Switch>
            </Layout>
          </InitApolloProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
});
