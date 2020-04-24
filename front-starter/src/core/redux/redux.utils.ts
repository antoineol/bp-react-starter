import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { put, PutEffect } from 'redux-saga/effects';
import { createSelector, OutputSelector } from 'reselect';
import { handleError } from '../../common/services/error.service';
import { AppStore, AppStoreDirectModel, StoreEntry, StoreOf, ToStoreEntry } from './redux.models';
import { getStore } from './redux.store';

/**
 * Selectors utility, to wrap values returned by reselect selectors to convert immutable object
 * into JavaScript values.
 * @param selectorImmutable
 */
// Nice to have: find a better typing that don't require consumer to provide the generic type
// (should be inferred)
// type ExtractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : Type;
// Extra notes: https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
export function toJS<T>(selectorImmutable: ToStoreEntry<T>): Readonly<T> {
  const record = selectorImmutable;
  if (record && typeof (record as any).toJS === 'function') {
    return (record as any).toJS();
  }
  // It's a bit hard to handle primitives well, so we make a shortcut: always assume it's a Record
  // (cf. redux.models.ts) and return encapsulated type.
  // Primitives are also assumed to be wrapped into a record, but it's not the case in reality,
  // so we use a cast in implementation for this specific case not to break the safe typing.
  return selectorImmutable as any;
}

// new redux utils

export interface SimpleAction<T = string, U = any> extends Action<T> {
  type: T;
  payload?: U;
}

export interface ActionWithPayload<T = string, U = any> extends Action<T> {
  type: T;
  payload: U;
}

/**
 * Dispatcher to use in functional components as hook
 */
export function useAppDispatch() {
  const dispatch = useDispatch();
  return useCallback(
    <T, U>(type: T, payload?: U) => dispatch({ type, payload }),
    [dispatch],
  );
}

/**
 * Dispatcher to use in a saga, with yield
 */
export function dispatchSaga<T, U>(type: T, payload?: U): PutEffect<SimpleAction<T, U>> {
  return put({ type, payload });
}

export function dispatchSagaErr<T, U>(type: T, error?: U,
                                      dontNotify?: boolean): PutEffect<SimpleAction<T, U>> {
  if (!dontNotify) {
    handleError(error);
  }
  return put({ type, payload: (!dontNotify && ((error && (error as any).message) || error)) });
}

/**
 * Dispatcher to use in a context that has no dedicated dispatcher, i.e. the store is unknown.
 * Example: use it in a utility function.
 * Don't: use in component (use `useAppDispatch` instead), use in a saga (use `dispatchSaga`
 * instead)
 */
export function dispatchOther<T, U>(type: T, payload?: U) {
  const store = getStore();
  store.dispatch({ type, payload });
}

type AppStoreFirstLevelType<T extends keyof AppStoreDirectModel, U extends keyof AppStoreDirectModel[T]> =
  StoreEntry<AppStoreDirectModel[T][U]>;

export type SelectorReturnType<T extends keyof AppStoreDirectModel, R> =
  OutputSelector<AppStore, R, (res: StoreOf<AppStoreDirectModel[T]>) => R>;

// Typescript function overloads to give types
export function selectState<T extends keyof AppStoreDirectModel, U extends keyof AppStoreDirectModel[T]>
(reducer: T,
 key: U): SelectorReturnType<T, AppStoreFirstLevelType<T, U>>;

export function selectState<T extends keyof AppStoreDirectModel, U extends keyof AppStoreDirectModel[T], TransfoRes>
(reducer: T, key: U,
 transformer?: (value: AppStoreFirstLevelType<T, U>) => TransfoRes): SelectorReturnType<T, TransfoRes>;


// You can then combine states with:
// `createSelector(select1, select2, (selected1, selected2) => ...)`
export function selectState<T extends keyof AppStoreDirectModel, U extends keyof AppStoreDirectModel[T], TransfoRes = any>
(reducer: T, key: U, transformer?: any): any {
  return createSelector(
    (state: AppStore) => state.get(reducer) as StoreOf<AppStoreDirectModel[T]>,
    state => transformer ? transformer(state.get(key)) : state.get(key),
  );
}

