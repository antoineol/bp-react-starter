import axios, { AxiosRequestConfig } from 'axios';
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

/**
 * Send a request to the app API. Ensures the user is authenticated and includes the authorization
 * token into the request header.
 * @param url
 * @param config
 */
export function* apiGet<T>(url: string, config?: AxiosRequestConfig): IterableIterator<any> {
  // You can wrap it in a securedRequest method to add security. Example:
  // return yield securedRequest(conf => axios.get<T>(`${env.apiPath}${url}`, conf), config);
  return yield axios.get<T>(`${env.apiPath}${url}`, config)
    .then(resp => resp.data);
}
