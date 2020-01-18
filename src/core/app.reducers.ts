import { connectRouter } from 'connected-react-router/immutable';
import { History } from 'history';
import { combineReducers } from 'redux-immutable';
import { AppStoreModel } from '../common/app.models';
import { FEATURES_REDUCER, featuresReducer } from '../common/services/features.service';
import { COUNT_REDUCER, countReducer } from '../home/count.service';
import { SECRET_REDUCER, secretReducer } from '../home/secret/secret.service';
import { AUTHOR_REDUCER, authorReducer } from '../profile/author.service';
import { PROFILE_REDUCER, profileReducer } from '../profile/profile.service';

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
  return combineReducers<AppStoreModel, any /*extends Action<any>*/>(
    {
      router: connectRouter(history),
      [COUNT_REDUCER]: countReducer,
      [SECRET_REDUCER]: secretReducer,
      [FEATURES_REDUCER]: featuresReducer,
      [PROFILE_REDUCER]: profileReducer,
      [AUTHOR_REDUCER]: authorReducer,
    });
}
