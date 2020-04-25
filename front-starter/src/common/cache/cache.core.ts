import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { StoreOf } from '../../core/redux/redux.models';
import { ActionWithPayload } from '../../core/redux/redux.utils';
import { RecursivePartial } from '../models/app.models';
import { AppCache, defaultCache } from './cache.model';

// Model
// To add to src/common/redux.models.ts

export const CACHE_REDUCER = 'cache';

export type CacheStore = StoreOf<AppCache>;

// Actions

export enum CacheAT {
  UpdateCache = '__CacheAT__UpdateCache',
}

type CacheAction = ActionWithPayload<CacheAT>;

// Selectors


// Reducer

const initialState: CacheStore = fromJS(defaultCache);

// To add to src/core/app.reducers.ts
export const cacheReducer: Reducer<CacheStore, CacheAction> =
  (state = initialState, { type, payload }) => {
    switch (type) {
      case CacheAT.UpdateCache:
        return state.mergeDeep(fromJS(payload as RecursivePartial<AppCache>));
      default:
        return state;
    }
  };
