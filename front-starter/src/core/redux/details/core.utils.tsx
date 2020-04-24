import { ApolloProvider } from '@apollo/react-common';
import { createBrowserHistory } from 'history';
import { fromJS } from 'immutable';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { appConfig } from '../../../common/app.config';
import { getGqlClient } from '../../../common/graphql.client';
import { handleError } from '../../../common/services/error.service';
import { env } from '../../../environment/env';
import { initAppServices } from '../../app.init';
import { createRootReducer } from '../app.reducers';
import { appSagas } from '../app.sagas';
import { AppStoreDirectModel } from '../redux.models';
import { setStoreAndHistory } from '../redux.store';
import { initialStore } from './initialStore';

// App creation is in a function so that we can reuse it in integration tests
// Not in app.utils to prevent circular dependencies.
export function makeApp(AppComp: any) {
  const history = createBrowserHistory();
  const store = configureStore(initialStore/*, history*/);
  setStoreAndHistory(store/*, history*/);
  initAppServices().catch(handleError);
  const app = <Provider store={store}>
    {/* Initializes Apollo GraphQL client for child components */}
    <ApolloProvider client={getGqlClient()}>
      {/* Initializes routing for child components */}
      <Router history={history}>
        <AppComp/>
      </Router>
    </ApolloProvider>
  </Provider>;
  return { app, history, store };
}

function configureStore(initialSore: Partial<AppStoreDirectModel> = {}/*, history: History*/) {

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancer: typeof compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(/*history*/),
    fromJS(initialSore),
    composeEnhancer(
      applyMiddleware(
        sagaMiddleware,
        // Add here extra middleware
      ),
    ),
  );

  if (!env.isNodeProduction && appConfig.useHotModuleReplacement && module.hot) {
    module.hot.accept('../app.reducers', () => {
      store.replaceReducer(createRootReducer());
    });
  }

  // Saga injection
  if (Array.isArray(appSagas)) {
    appSagas.forEach((saga: any /* Saga */) => sagaMiddleware.run(saga));
  }

  return store;
}
