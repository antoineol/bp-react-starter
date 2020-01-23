// Polyfills imports should be the first lines.
import { ApolloProvider } from '@apollo/react-common';
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
import { getGqlClient } from './common/graphql.client';
import { handleError } from './common/services/error.service';
import { unregister } from './core/_bootstrap/serviceWorker';
import { initAppServices } from './core/app.init';

// Init the app.
const rootElt = document.getElementById('root');
const gqlClient = getGqlClient();
// Complete this function with all services initializations you need to do to bootstrap the app.
// Example: load server config asap. initAppServices().catch(handleError); }, []);
initAppServices().catch(handleError);

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
  return render(
    // Initializes Apollo GraphQL client for child components
    <ApolloProvider client={gqlClient}>
      <AppComp history={createBrowserHistory()} />
    </ApolloProvider>, rootElt);
}
