import { List, Record } from 'immutable';
import { COUNT_REDUCER, CountModel } from '../../views/home/count2.service';
import { REDUX_APOLLO_REDUCER, ReduxApolloModel } from '../redux-apollo/redux-apollo.core';

export interface AppStoreDirectModel {
  [REDUX_APOLLO_REDUCER]: ReduxApolloModel,
  [COUNT_REDUCER]: CountModel;
}

export type Primitive = string | number | boolean | symbol | undefined | null;
export type ImmutableEntry<T> = Record<T> | StoreOf<T>;

export type StoreEntry<T> = T extends Primitive | ImmutableEntry<any> ? T : T extends unknown[] ? List<T[number]> : Record<T>;
export type ToStoreEntry<T> = T extends Primitive ? T : T extends unknown[] ? List<T[number]> : Record<T>;

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

  // Later, complete this interface as you need more of the immutablejs methods. Their default types
  // are not suitable to Redux store types, so we improve them here
}

export type AppStoreModel = {
  [K in keyof AppStoreDirectModel]: StoreOf<AppStoreDirectModel[K]>
};

export type AppStore = StoreOf<AppStoreModel>;
