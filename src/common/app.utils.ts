import { QueryHookOptions, useQuery } from '@apollo/react-hooks';
import { OperationVariables } from 'apollo-client';
import { Observable } from 'apollo-client/util/Observable';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { DocumentNode } from 'graphql';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { put, PutEffect } from 'redux-saga/effects';
import { createSelector, OutputSelector } from 'reselect';
import { Query_Root, Subscription_Root } from '../../hasura/gen/types';
import { showSignIn } from '../auth/auth.service';
import { getStoreAndHistory } from '../core/app.store';
import { env } from '../environment/env';
import { appConfig } from './app.config';
import { AppStore, AppStoreDirectModel, StoreEntry, StoreOf } from './app.models';
import { getGqlClient } from './graphql.client';
import { AppCache } from './models/defaultStore';
import { handleError } from './services/error.service';

/**
 * Use it to wrap functions, e.g. components handlers to add loading and error
 * handling, both synchronous and asynchronous with promise. If an error is thrown
 * and setError is not provided, `handleError` is called instead.
 * @param fn function surrounded with try/catch
 * @param setLoading component loading state setter
 * @param setError component error state setter
 */
export function asyncHandler(
  fn: (...args: any[]) => any | Promise<any>,
  setLoading?: (loading: boolean) => void,
  setError?: (error: any) => void) {
  const hasLoadingHandler = arguments.length >= 2 && setLoading;
  const hasErrorHandler = arguments.length >= 3 && setError;
  return async (...args: any[]) => {
    if (hasLoadingHandler) setLoading!(true);
    try {
      return await fn(...args);
    } catch (e) {
      if (hasErrorHandler) {
        setError!(e);
      } else {
        handleError(e);
      }
    } finally {
      if (hasLoadingHandler) setLoading!(false);
    }
  };
}

/**
 * Write data to Apollo cache. Cache can be read in components with useQuery hook. The cache
 * should remain the source of truth. To enforce this pattern, its values are immutable. Use
 * writeCache to change their value.
 * @param data
 * @param id
 */
export function writeCache<TData extends Partial<AppCache>>(data: TData, id?: string) {
  const gqlClient = getGqlClient();
  gqlClient.writeData({ data, id });
}

/**
 * Custom hook to read from cache with a slightly improved syntax and typing. The result is not
 * systematically typed with undefined (which does not make sense for local cache and breaks
 * destructuring) but with only the generic type, leaving the type responsibility to the
 * specific model and component.
 * @param query
 * @param options
 */
export function useCache<TData extends AppCache, TVariables = OperationVariables>
(query: DocumentNode, options?: QueryHookOptions<TData, TVariables>): TData {
  const { data, error } = useQuery(query, options);
  if (error) {
    console.error('Error when retrieving cache:', error);
  }
  return data as TData || {};
}

// new redux utils

export interface SimpleAction<T = string, U = any> extends Action<T> {
  type: T;
  payload?: U;
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
  const { store } = getStoreAndHistory();
  store.dispatch({ type, payload });
}

// Typescript function overloads to give types
export function selectState<T extends keyof AppStoreDirectModel, U extends keyof AppStoreDirectModel[T]>
(reducer: T,
 key: U): OutputSelector<AppStore, StoreEntry<AppStoreDirectModel[T][U]>, (res: StoreOf<AppStoreDirectModel[T]>) => StoreEntry<AppStoreDirectModel[T][U]>>;

export function selectState<T extends keyof AppStoreDirectModel, U extends keyof AppStoreDirectModel[T], TransfoRes>
(reducer: T, key: U,
 transformer?: (value: StoreEntry<AppStoreDirectModel[T][U]>) => TransfoRes): OutputSelector<AppStore, TransfoRes, (res: StoreOf<AppStoreDirectModel[T]>) => TransfoRes>;

// You can then combine states with:
// `createSelector(select1, select2, (selected1, selected2) => ...)`
export function selectState<T extends keyof AppStoreDirectModel, U extends keyof AppStoreDirectModel[T], TransfoRes = any>
(reducer: T, key: U, transformer?: any): any {
  return createSelector(
    (state: AppStore) => state.get(reducer) as StoreOf<AppStoreDirectModel[T]>,
    state => transformer ? transformer(state.get(key)) : state.get(key),
  );
}

/**
 * Sends a GraphQL request to the app API.
 * @param query the GraphQL query. Use gql`query { ... }` syntax to build it.
 */
export async function apiQuery<T = Query_Root, TVariables = OperationVariables>(
  query: DocumentNode): Promise<T> {
  const gqlClient = getGqlClient();
  const { data, errors } = await gqlClient.query<T, TVariables>({ query });
  if (errors) {
    throw errors;
  }
  return data;
}

export async function apiMutate<T = any, TVariables = OperationVariables>(
  mutation: DocumentNode, variables?: TVariables): Promise<T | null | undefined> {
  const gqlClient = getGqlClient();
  const { data, errors } = await gqlClient.mutate<T, TVariables>({ mutation, variables });
  if (errors) {
    throw errors;
  }
  return data;
}

export function apiSubscribe<T = Subscription_Root, TVariables = OperationVariables>(
  query: DocumentNode): Observable<T | null | undefined> {
  const gqlClient = getGqlClient();
  return gqlClient.subscribe<T, TVariables>({ query }).map((res => res.data));
}

/**
 * Sends a GET request to the app API (REST classic method).
 * @param url API URL
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export async function apiGet<T>(url: string,
                                config?: AxiosRequestConfig): Promise<T> {
  return httpGet(`${env.apiPath}${url}`, config);
}

/**
 * Sends a POST request to the app API.
 * @param url API URL
 * @param body body to include in the POST request
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export async function apiPost<T>(url: string, body?: any,
                                 config?: AxiosRequestConfig): Promise<T> {
  return httpPost(`${env.apiPath}${url}`, body, config);
}

export async function httpGet<T>(url: string,
                                 config?: AxiosRequestConfig): Promise<T> {
  return httpReq(config, url, config => axios.get<T>(url, config));
}

export async function httpPost<T>(url: string, body?: any,
                                  config?: AxiosRequestConfig): Promise<T> {
  return httpReq(config, url, config => axios.post<T>(url, body, config));
}

async function httpReq<T>(config: AxiosRequestConfig | undefined,
                          url: string,
                          sendRequest: (config: AxiosRequestConfig) => Promise<AxiosResponse<T>>): Promise<T> {
  const conf = extendConfig(config);
  let resp: AxiosResponse<T> | undefined;
  try {
    resp = await sendRequest(conf);
  } catch (e) {
    const err: AxiosError = e;
    if (!err || !err.isAxiosError || !err.response) {
      throw err;
    }
    // Retry
    if (err.response.status === 401) {
      await showSignIn();
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    resp = await sendRequest(conf);
  }
  if (!resp) {
    console.error(`request to ${url} returned undefined. Maybe a missing mock?` +
      ' Ensure a mock is properly defined at the beginning of this test, e.g.' +
      ' `mockApiGet(() => ({}));`');
    throw new Error('Missing mock error');
  }
  return resp.data;
}

// CSRF protection if the server requires this token
const requiredHeaders = { 'X-Requested-By': appConfig.securityRequestedByHeader };
export const defaultOptions = { headers: requiredHeaders }; // Useful for tests

function extendConfig(config: AxiosRequestConfig | undefined) {
  // For security, it is recommended to rely on secured cookies: keep the JWT
  // in 2 cookies (1 normal with header + payload, 1 httpOnly with signature). The server
  // concatenates the 2 cookie values to rebuild the full JWT. Server-side logout removes the 2
  // cookies, client-side logout removes the public cookie only.
  const { headers, ...otherConf } = config || {} as AxiosRequestConfig;
  return {
    ...otherConf,
    headers: {
      ...headers,
      ...requiredHeaders,
    },
  };
}

export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return (parts.pop() as string).split(';').shift();
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
