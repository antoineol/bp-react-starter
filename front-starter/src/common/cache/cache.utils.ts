import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import { AppStore, ExtractImmutableType } from '../../core/redux/redux.models';
import { getStore } from '../../core/redux/redux.store';
import { createAppSelector, dispatchOther, toJS } from '../../core/redux/redux.utils';
import { RecursivePartial } from '../models/app.models';
import { CACHE_REDUCER, CacheAT, CacheStore } from './cache.core';
import { AppCache } from './cache.model';

// Create your cache selectors in your services using below utilities.

/**
 * @param selector function with CacheStore as argument returning what you want to read in the
 * cache.
 * @example
 * ```ts
 * const selectCount = selectCache(cache => cache.get('home').get('count'));
 * // ... in component:
 * const count = useSelector(selectCount);
 * ```
 */
export function createCacheSelector<Selected>(selector: (cache: CacheStore) => Selected) {
  return createSelector(
    (state: AppStore) => state.get(CACHE_REDUCER) as CacheStore,
    selector,
  );
}

/**
 * Shorthand for `selectCacheDeep(cache => cache.get(key));`
 * @param key Top-level cache key to read.
 * @example
 * ```ts
 * const selectJwt = selectCacheTopLevel('jwt');
 * // ... in component:
 * const jwt = useSelector(selectJwt);
 * ```
 */
export function createCacheSelectorTopLevel<K extends keyof AppCache>(key: K) {
  return createAppSelector(CACHE_REDUCER, key);
}

/**
 * Write data to Apollo cache. Cache can be read in components with useQuery hook. The cache
 * should remain the source of truth. To enforce this pattern, its values are immutable. Use
 * writeCache to change their value.
 * @param data The partial to write in cache. If the content added cannot be found in queries or
 * you have a weird error, try to add __typename like what is in defaultStore (should match the
 * type name in localStore.graphql schema).
 */
export function writeCache(data: RecursivePartial<AppCache>) {
  dispatchOther(CacheAT.UpdateCache, fromJS(data));
}

/**
 * This function is for one-shot read of the cache, e.g. in response to an event. It uses
 * `toJS()` to convert immutablejs values to javascript objects which may be expensive on big
 * object and is not optimized for usage in component renders (a component would read the cache
 * at each rendering)
 * @param reader a function taking the cache object as argument and returning the value to
 * extract from the cache.
 * @example
 * ```ts
 * const count = readCache(cache => cache.get('home').get('count'));
 * ```
 */
export function readCache<T>(reader: (cache: CacheStore) => T): ExtractImmutableType<T> {
  const store = getStore();
  const state = store.getState() as unknown as AppStore;
  const cache: CacheStore = state.get(CACHE_REDUCER);
  const extracted = reader(cache);
  return toJS(extracted);
}
