import axios, { AxiosRequestConfig } from 'axios';
import { Action } from 'redux';
import { env } from '../environment/env';
import { ToStoreEntry } from './app.models';

/**
 * Selectors utility, to wrap values returned by reselect selectors to convert immutable object
 * into JavaScript values.
 * @param selectorImmutable
 */
// TODO find a better typing that don't require consumer to provide the generic type (should be
// inferred)
// type ExtractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : Type;
// Extra notes: https://itnext.io/typescript-extract-unpack-a-type-from-a-generic-baca7af14e51
export function toJS<T>(selectorImmutable: ToStoreEntry<T>): Readonly<T> {
  const record = selectorImmutable;
  if (record && typeof (record as any).toJS === 'function') {
    return (record as any).toJS();
  }
  // It's a bit hard to handle primitives well, so we make a shortcut: always assume it's a Record
  // (cf. app.models.ts) and return encapsulated type.
  // Primitives are also assumed to be wrapped into a record, but it's not the case in reality,
  // so we use a cast in implementation for this specific case not to break the safe typing.
  return selectorImmutable as any;
}

export function dispatch<T extends Action>(action: T) {
  return action;
}

export const mapDispatchToProps = { dispatch };
export type Dispatcher = typeof mapDispatchToProps;

/**
 * Sends a GET request to the app API.
 * @param url API URL
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export function* apiGet<T>(url: string,
                           config?: AxiosRequestConfig): IterableIterator<any> {
  const conf = extendConfig(config);
  const getRes = conf ?
    axios.get<T>(`${env.apiPath}${url}`, conf) :
    axios.get<T>(`${env.apiPath}${url}`);
  if (!getRes) {
    console.error('axios.get() returned undefined. Maybe a missing mock? Check below stack' +
      ' trace, the beginning of the stack trace (bottom) will give you which test is throwing' +
      ' this error. Ensure a mock is properly defined at the beginning of this test, e.g.' +
      ' `mockApiGet(() => ({}));`');
    console.error(new Error('Missing mock error').stack);
    return;
  }
  return yield getRes.then(resp => resp.data);
}

/**
 * Sends a POST request to the app API.
 * @param url API URL
 * @param body body to include in the POST request
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export function* apiPost<T>(url: string, body?: any,
                            config?: AxiosRequestConfig): IterableIterator<any> {
  const conf = extendConfig(config);
  const postRes = conf ?
    axios.post<T>(`${env.apiPath}${url}`, body, conf) :
    axios.post<T>(`${env.apiPath}${url}`, body);
  if (!postRes) {
    console.error('axios.post() returned undefined. Maybe a missing mock? Check below stack' +
      ' trace, the beginning of the stack trace (bottom) will give you which test is throwing' +
      ' this error. Ensure a mock is properly defined at the beginning of this test, e.g.' +
      ' `mockApiPost(() => ({ success: true }));`');
    console.error(new Error('Missing mock error').stack);
    return;
  }
  return yield postRes.then(resp => resp.data);
}

// CSRF protection if the server requires this token
const requiredHeaders = { 'X-Requested-By': 'ci-app' };
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
