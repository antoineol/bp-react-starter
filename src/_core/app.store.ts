import { routerMiddleware } from 'connected-react-router/immutable';
import { History } from 'history';
import { fromJS } from 'immutable';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { AppStoreDirectModel } from '../common/app.models';
import { createRootReducer } from './app.reducers';
import { appSagas } from './app.sagas';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__<R>(...args: any): (...args: any[]) => R;
  }
}

const sagaMiddleware = createSagaMiddleware();

export function configureStore(initialSore: Partial<AppStoreDirectModel> = {}, history: History) {
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
    // Add here extra middlewares, like router middleware to sync URL to state
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers: any =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
  /* eslint-enable */

  const store = createStore(
    createRootReducer(history),
    fromJS(initialSore),
    composeEnhancers(...enhancers),
  );

  // Saga injection
  if (Array.isArray(appSagas)) {
    appSagas.forEach((saga) => sagaMiddleware.run(saga));
  }

  return store;

}
