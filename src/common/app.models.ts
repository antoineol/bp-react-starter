import { RouterRootState } from 'connected-react-router';
import { RouterState } from 'connected-react-router/immutable';
import { List, Record } from 'immutable';
import { AUTH_REDUCER, AuthModel } from '../auth/auth.service';
import { COUNT_REDUCER, CountModel } from '../home/count.service';
import { SECRET_REDUCER, SecretModel } from '../home/secret/secret.service';
import { AUTHOR_REDUCER, AuthorModel } from '../profile/author.service';
import { PROFILE_REDUCER, ProfileModel } from '../profile/profile.service';
import { FEATURES_REDUCER, FeaturesModel } from './services/features.service';

export interface AppStoreDirectModel extends RouterRootState {
  [COUNT_REDUCER]: CountModel;
  [SECRET_REDUCER]: SecretModel;
  [AUTH_REDUCER]: AuthModel;
  [FEATURES_REDUCER]: FeaturesModel;
  [PROFILE_REDUCER]: ProfileModel;
  [AUTHOR_REDUCER]: AuthorModel;
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
  [K in keyof AppStoreDirectModel]:
  AppStoreDirectModel[K] extends RouterState ? AppStoreDirectModel[K] : StoreOf<AppStoreDirectModel[K]>
};

export type AppStore = StoreOf<AppStoreModel>;

export enum JwtFields {
  jwtNamespace = 'https://hasura.io/jwt/claims',
  jwtClaimRoles = 'x-hasura-allowed-roles',
  jwtClaimDefaultRole = 'x-hasura-default-role',
  jwtClaimUserId = 'x-hasura-user-id',
}
