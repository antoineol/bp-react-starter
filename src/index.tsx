import React from 'react';
import { render } from 'react-snapshot';
import 'typeface-roboto';
import App from './App';
import { makeApp } from './core/_bootstrap/core.utils';
import { unregister } from './core/_bootstrap/serviceWorker';
import './index.css';

// Init the app.
const rootElt = document.getElementById('root');

renderApp(App);

// Hot Module Replacement (HMR) to update the app content while developing without refreshing the
// whole Web page
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    renderApp(NextApp);
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();

function renderApp(AppComp: typeof App) {
  const { app } = makeApp(AppComp);
  return render(app, rootElt);
}
