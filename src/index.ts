// Remove polyfills if you don't need IE11 support.
// Also adjust package.json browserslist entry to adjust what is transpiled at build time
// (https://facebook.github.io/create-react-app/docs/supported-browsers-features)
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// If all users are on internet, consider using polyfill.io instead to dynamically detect the user's
// browser and the polyfills he needs. A sample usage is in index.html. But don't use both
// react-app-polyfill and polyfill.io.
import { render } from 'react-snapshot';
import App from './App';
import { useHotModuleReplacement } from './common/app.config';
import { makeApp } from './core/_bootstrap/core.utils';
import { unregister } from './core/_bootstrap/serviceWorker';
import './index.css';

// Init the app.
const rootElt = document.getElementById('root');

renderApp(App);

// Hot Module Replacement (HMR) to update the app content while developing without refreshing the
// whole Web page
if (useHotModuleReplacement && module.hot) {
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
