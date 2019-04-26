import { createBrowserHistory, History } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { AppStoreDirectModel } from '../../common/app.models';
import { configureStore } from './app.store';

// App creation is in a function so that we can reuse it in integration tests
// Not in app.utils to prevent circular dependencies.
export function makeApp(AppComp: any, initialStore: Partial<AppStoreDirectModel> = {}) {
  const history: History = createBrowserHistory();
  const store = configureStore(initialStore, history);
  const app = <Provider store={store}>
    <AppComp history={history} />
  </Provider>;
  return { app, history, store };
}
