import { connectRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import { combineReducers } from 'redux-immutable';
import { AppStoreModel } from '../common/app.models';
import { COUNTER_REDUCER, counterReducer } from '../home/home.service';

export function createRootReducer(history: History) {
  // const rootReducer = combineReducers<Partial<AppStoreModel>, Action<void>>({
  //   [AUTH_REDUCER]: authReducer,
  //   [PRODUCTS_REDUCER]: productsReducer,
  // });
  // // Wrap the root reducer and return a new root reducer with router state
  // const mergeWithRouterState = connectRouter(history);
  // return mergeWithRouterState(rootReducer);

  // connected-react-router v5 - KO, has an issue:
  // https://github.com/supasate/connected-react-router/issues/115
  return combineReducers<Partial<AppStoreModel>, any /*extends Action<any>*/>(
    {
      router: connectRouter(history),
      [COUNTER_REDUCER]: counterReducer,
    });
}
