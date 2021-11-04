// Polyfills imports should be the first lines.
// Remove polyfills if you don't need IE11 support.
// Also adjust package.json browserslist entry to adjust what is transpiled at build time
// (https://facebook.github.io/create-react-app/docs/supported-browsers-features)
// If all users are on internet, consider using polyfill.io instead to dynamically detect the user's
// browser and the polyfills he needs. A sample usage is in index.html. But don't use both
// react-app-polyfill and polyfill.io.
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { handleError } from './common/services/error.service';
import { initAppServices } from './core/app.init';
import { store } from './core/redux/store';
import { Auth0SetMethods } from './features/auth/get-auth0-token';
import { InitAuth0Provider } from './features/auth/init-auth';

// Init the app.

// Service worker are initialized in initAppServices()
initAppServices().catch(handleError);

render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Initializes routing for child components */}
      <BrowserRouter>
        <InitAuth0Provider>
          <Auth0SetMethods />
          <App />
        </InitAuth0Provider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
