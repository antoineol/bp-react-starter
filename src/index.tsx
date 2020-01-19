// Polyfills imports should be the first lines.
import { createBrowserHistory } from 'history';
import React from 'react';
// Remove polyfills if you don't need IE11 support.
// Also adjust package.json browserslist entry to adjust what is transpiled at build time
// (https://facebook.github.io/create-react-app/docs/supported-browsers-features)
// If all users are on internet, consider using polyfill.io instead to dynamically detect the user's
// browser and the polyfills he needs. A sample usage is in index.html. But don't use both
// react-app-polyfill and polyfill.io.
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { render } from 'react-snapshot';
import App from './App';
import { appConfig } from './common/app.config';
import { unregister } from './core/_bootstrap/serviceWorker';

// Init the app.
const rootElt = document.getElementById('root');

renderApp(App);

// Hot Module Replacement (HMR) to update the app content while developing without refreshing the
// whole Web page
if (appConfig.useHotModuleReplacement && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    renderApp(NextApp);
    console.log('App hot-reloaded. You can continue your tests.');
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();

function renderApp(AppComp: typeof App) {
  return render(<AppComp history={createBrowserHistory()} />, rootElt);
}
