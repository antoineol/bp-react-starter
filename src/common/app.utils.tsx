import axios, { AxiosRequestConfig } from 'axios';
import { Record } from 'immutable';
import React from 'react';

/**
 * Selectors utility, to wrap values returned by reselect selectors to convert immutable object
 * into JavaScript values.
 * @param selectorImmutable
 */
export function toJS<T>(selectorImmutable: Record<T>): Readonly<T> {
  const record = selectorImmutable as Record<T>;
  if (record && typeof record.toJS === 'function') {
    return record.toJS();
  }
  // It's a bit hard to handle primitives well, so we make a shortcut: always assume it's a Record
  // (cf. app.models.ts) and return encapsulated type.
  // Primitives are also assumed to be wrapped into a record, but it's not the case in reality,
  // so we use a cast in implementation for this specific case not to break the safe typing.
  return selectorImmutable as unknown as T;
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
  return yield axios.get<T>(`https://jsonplaceholder.typicode.com${url}`, config)
    .then(resp => resp.data);
}
