import { combineReducers } from 'redux-immutable';
import { apolloReducer, REDUX_APOLLO_REDUCER } from '../redux-apollo/redux-apollo.core';
import { AppStoreModel } from './redux.models';

export function createRootReducer() {
  return combineReducers<AppStoreModel, any /*extends Action<any>*/>(
    {
      [REDUX_APOLLO_REDUCER]: apolloReducer,
    });
}
