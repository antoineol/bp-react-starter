import { SerializedError, Slice } from '@reduxjs/toolkit';
import { Reducer } from 'redux';


export type SliceToState<TSlice> = TSlice extends Slice<infer State> ? State : unknown;
export type ReducerToState<TSlice> = TSlice extends Reducer<infer State> ? State : unknown;
export type ReducerToAppState<TReducer> = { [K in keyof TReducer]: ReducerToState<TReducer[K]> };

// https://redux-toolkit.js.org/api/createAsyncThunk
export interface RejectedAction<ThunkArg = any> {
  type: string;
  payload: undefined;
  error: SerializedError | any;
  meta: {
    requestId: string;
    arg: ThunkArg;
    aborted: boolean;
    condition: boolean;
  };
}


// export interface AppStoreDirectModel {
//   [REDUX_APOLLO_REDUCER]: ReduxApolloModel;
//   [CACHE_REDUCER]: AppCache;
// }
//
// export type Primitive = string | number | boolean | symbol | undefined | null;
// export type ImmutableEntry<T> = Record<T> | StoreOf<T>;
//
// export type StoreEntry<T> = T extends Primitive | ImmutableEntry<any> ? T : T extends (infer
// U)[] ? List<StoreEntry<U>> : Record<T>;  // If something is wrong in the type below or with
// toJS, try replacing ImmutableEntry with Record export type ExtractImmutableType<T> = T extends
// Primitive ? T : T extends ImmutableEntry<infer U> ? U : T extends List<infer V> ? V[] : T;
// export interface StoreOf<T> { get<U extends keyof T>(key: U): StoreEntry<T[U]>;  // Ideally, we
// should get the nth type, following the list of attributes... but how to do that // with typing?
// For now, let's keep any and count on the cast. getIn<U extends keyof T>(keys: string[]):
// /*StoreEntry<T[U]>*/any;  set<U extends keyof T>(key: U, value: T[U]): this;  remove<U extends
// keyof T>(key: U): this;  setIn<U extends keyof T>(keys: string[], value: Primitive |
// ImmutableEntry<any>): this;  removeIn<U extends keyof T>(keys: string[]): this;  merge(other:
// any): this;  mergeDeep(other: any): this;  // Later, complete this interface as you need more of
// the immutablejs methods. Their default types // are not suitable to Redux store types, so we
// improve them here }  export type AppStoreModel = { [K in keyof AppStoreDirectModel]:
// StoreOf<AppStoreDirectModel[K]> };  export type AppStore = StoreOf<AppStoreModel>;
