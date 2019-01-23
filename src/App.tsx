import { createMuiTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { History } from 'history';
import React, { Component } from 'react';
import { appTheme } from './_core/app.theme';
import ConnectedHome from './home/ConnectedHome';

const muiTheme = createMuiTheme(appTheme);

interface Props /*extends WithStyles<typeof styles>*/
{
  history: History;
}

export default class App extends Component<Props> {
  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ConnectedHome />
      </MuiThemeProvider>
    );
  }
}
