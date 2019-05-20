import { RouterState } from 'connected-react-router/immutable';
import { Record } from 'immutable';
import { COUNTER_REDUCER, CounterModel } from '../home/count.service';
import { SECRET_REDUCER, SecretModel } from '../home/secret/secret.service';
import { ROUTER_REDUCER } from './routes.service';

export type Primitive = string | number | boolean | symbol | undefined | null;
export type ImmutableEntry<T> = Record<T> | StoreOf<T>;

export type StoreEntry<T> = T extends Primitive | ImmutableEntry<any> ? T : Record<T>;
export type ToStoreEntry<T> = T extends Primitive ? T : Record<T>;

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

export interface AppStoreDirectModel {
  [ROUTER_REDUCER]: RouterState;
  [COUNTER_REDUCER]: CounterModel;
  [SECRET_REDUCER]: SecretModel;
}

export type AppStoreModel = {
  [K in keyof AppStoreDirectModel]:
  AppStoreDirectModel[K] extends RouterState ? AppStoreDirectModel[K] : StoreOf<AppStoreDirectModel[K]>
}

export type AppStore = StoreOf<AppStoreModel>;
