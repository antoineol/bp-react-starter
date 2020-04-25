import { List, Record } from 'immutable';
import { CACHE_REDUCER } from '../../common/cache/cache.core';
import { AppCache } from '../../common/cache/cache.model';
import { REDUX_APOLLO_REDUCER, ReduxApolloModel } from './redux-apollo.core';

export interface AppStoreDirectModel {
  [REDUX_APOLLO_REDUCER]: ReduxApolloModel,
  [CACHE_REDUCER]: AppCache,
}

export type Primitive = string | number | boolean | symbol | undefined | null;
export type ImmutableEntry<T> = Record<T> | StoreOf<T>;

export type StoreEntry<T> = T extends Primitive | ImmutableEntry<any> ? T : T extends (infer U)[] ? List<U> : Record<T>;

// If something is wrong in the type below or with toJS, try replacing ImmutableEntry with Record
export type ExtractImmutableType<T> = T extends Primitive ? T : T extends ImmutableEntry<infer U> ? U :
  T extends List<infer V> ? V[] : T;

export interface StoreOf<T> {
  get<U extends keyof T>(key: U): StoreEntry<T[U]>;

  // Ideally, we should get the nth type, following the list of attributes... but how to do that
  // with typing? For now, let's keep any and count on the cast.
  getIn<U extends keyof T>(keys: string[]): /*StoreEntry<T[U]>*/any;

  set<U extends keyof T>(key: U, value: T[U]): this;

  remove<U extends keyof T>(key: U): this;

  setIn<U extends keyof T>(keys: string[], value: Primitive | ImmutableEntry<any>): this;

  removeIn<U extends keyof T>(keys: string[]): this;

  merge(other: any): this;

  mergeDeep(other: any): this;

  // Later, complete this interface as you need more of the immutablejs methods. Their default types
  // are not suitable to Redux store types, so we improve them here
}

export type AppStoreModel = {
  [K in keyof AppStoreDirectModel]: StoreOf<AppStoreDirectModel[K]>
};

export type AppStore = StoreOf<AppStoreModel>;
