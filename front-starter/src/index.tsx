// Polyfills imports should be the first lines.
// Remove polyfills if you don't need IE11 support.
// Also adjust package.json browserslist entry to adjust what is transpiled at build time
// (https://facebook.github.io/create-react-app/docs/supported-browsers-features)
// If all users are on internet, consider using polyfill.io instead to dynamically detect the user's
// browser and the polyfills he needs. A sample usage is in index.html. But don't use both
// react-app-polyfill and polyfill.io.
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import { render } from 'react-dom';
import App from './App';
import { appConfig } from './common/app.config';
import { makeApp } from './core/redux/details/core.utils';

// Init the app.
const rootElt = document.getElementById('root');
// Complete this function with all services initializations you need to do to bootstrap the app.
// Example: load server config asap. initAppServices().catch(handleError); }, []);
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

// Service worker are initialized in initAppServices()

// This render contains all platform-specific code, e.g. what should not be included in tests
// (a mock is provided instead).
function renderApp(AppComp: typeof App) {
  const { app } = makeApp(AppComp);
  return render(app, rootElt);
}
