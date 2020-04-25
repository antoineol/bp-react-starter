import { combineReducers } from 'redux-immutable';
import { CACHE_REDUCER, cacheReducer } from '../../common/cache/cache.core';
import { apolloReducer, REDUX_APOLLO_REDUCER } from './redux-apollo.core';
import { AppStoreModel } from './redux.models';

export function createRootReducer() {
  return combineReducers<AppStoreModel, any /*extends Action<any>*/>(
    {
      [REDUX_APOLLO_REDUCER]: apolloReducer,
      [CACHE_REDUCER]: cacheReducer,
    });
}
