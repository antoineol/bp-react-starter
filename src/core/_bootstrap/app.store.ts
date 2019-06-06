import { routerMiddleware } from 'connected-react-router/immutable';
import { History } from 'history';
import { fromJS } from 'immutable';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { AppStoreDirectModel } from '../../common/app.models';
import { createRootReducer } from '../app.reducers';
import { appSagas } from '../app.sagas';

export function configureStore(initialSore: Partial<AppStoreDirectModel> = {}, history: History) {

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

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('../app.reducers', () => {
        store.replaceReducer(createRootReducer(history));
      });
    }
  }

  // Saga injection
  if (Array.isArray(appSagas)) {
    appSagas.forEach((saga) => sagaMiddleware.run(saga));
  }

  return store;

}
