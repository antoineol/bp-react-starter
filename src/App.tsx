import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import React, { memo } from 'react';
import { Route, Switch } from 'react-router';
import { appTheme } from './core/app.theme';
import Home from './home/Home';

const muiTheme = createMuiTheme(appTheme);

export interface Props {
  history: History;
}

const App: React.FC<Props> = ({ history }: Props) => {
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
};
export default memo(App);
