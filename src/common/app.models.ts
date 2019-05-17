import { RouterState } from 'connected-react-router/immutable';
import { Record } from 'immutable';
import { COUNTER_REDUCER, CounterModel } from '../home/count.service';
import { SECRET_REDUCER, SecretModel } from '../home/secret/secret.service';
import { ROUTER_REDUCER } from './routes.service';

export interface StoreOf<T> {
  get<U extends keyof T>(key: U): T[U] extends StoreOf<any> ? T[U] : Record<T[U]>;

  set<U extends keyof T>(key: U, value: T[U]): this;
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
