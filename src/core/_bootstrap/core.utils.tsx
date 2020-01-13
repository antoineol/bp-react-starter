import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { fromJS } from 'immutable';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { appConfig } from '../../common/app.config';
import { AppStoreDirectModel } from '../../common/app.models';
import { env } from '../../environment/env';
import { createRootReducer } from '../app.reducers';
import { appSagas } from '../app.sagas';
import { setStoreAndHistory } from '../app.store';
import { initialStore } from './initialStore';

// App creation is in a function so that we can reuse it in integration tests
// Not in app.utils to prevent circular dependencies.
export function makeApp(AppComp: any) {
  const history = createBrowserHistory();
  const store = configureStore(initialStore, history);
  setStoreAndHistory(store, history);
  const app = <Provider store={store}>
    <AppComp history={history} />
  </Provider>;
  return { app, history, store };
}

function configureStore(initialSore: Partial<AppStoreDirectModel> = {}, history: History) {

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancer: typeof compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(history),
    fromJS(initialSore),
    composeEnhancer(
      applyMiddleware(
        sagaMiddleware,
        routerMiddleware(history),
        // Add here extra middleware
      ),
    ),
  );

  if (!env.isNodeProduction && appConfig.useHotModuleReplacement && module.hot) {
    module.hot.accept('../app.reducers', () => {
      store.replaceReducer(createRootReducer(history));
    });
  }

  // Saga injection
  if (Array.isArray(appSagas)) {
    appSagas.forEach((saga: any /* Saga */) => sagaMiddleware.run(saga));
  }

  return store;
}
