import { QueryHookOptions, useQuery, useSubscription } from '@apollo/react-hooks';
import { OperationVariables } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { useCallback } from 'react';
import { Mutation_Root } from '../../../generated/schema';
import { getGqlClient } from '../graphql.client';
import { AppCache, defaultStore } from '../localStore';
import { RecursivePartial } from '../models/app.models';
import { handleError } from '../services/error.service';

/**
 * Use it to wrap functions, e.g. components handlers to add loading and error
 * handling, both synchronous and asynchronous with promise. If an error is thrown
 * and setError is not provided, `handleError` is called instead.
 *
 * If the reference to the handler can change (e.g. arrow notation function), consider wrapping it
 * with useCallback to optimize it.
 *
 * @param handler async function surrounded with try/catch
 * @param setLoading component loading state setter (useState is recommended to generate it)
 * @param setError component error state setter (useState is recommended to generate it)
 */
export function useAsyncHandler(
  handler: (...args: any[]) => Promise<any>,
  setLoading?: (loading: boolean) => void,
  setError?: (error: any) => void) {
  return useCallback(async (...args: any[]) => {
    if (setLoading) setLoading(true);
    try {
      return await handler(...args);
    } catch (e) {
      handleError(e);
      if (setError && (!e || e.message !== 'CANCELED')) setError(e);
    } finally {
      if (setLoading) setLoading(false);
    }
  }, [handler, setError, setLoading]);
}

/**
 * Write data to Apollo cache. Cache can be read in components with useQuery hook. The cache
 * should remain the source of truth. To enforce this pattern, its values are immutable. Use
 * writeCache to change their value.
 * @param data The partial to write in cache. If the content added cannot be found in queries or
 * you have a weird error, try to add __typename like what is in defaultStore (should match the
 * type name in localStore.graphql schema).
 * @param id Optional id property used to write a fragment to an existing object in the store.
 */
export function writeCache(data: RecursivePartial<AppCache>, id?: string) {
  const gqlClient = getGqlClient();
  addTypeNames(data);
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
  const { data = {}, error } = useQuery(query, { ...options, fetchPolicy: 'cache-only' });
  if (error) {
    console.error('Error when retrieving cache:', error);
  }
  return data as TData;
}

export function useCacheSub<TData extends AppCache, TVariables = OperationVariables>
(query: DocumentNode, options?: QueryHookOptions<TData, TVariables>): TData {
  const { data = {}, error } = useSubscription(query, { ...options, fetchPolicy: 'cache-only' });
  if (error) {
    console.error('Error when retrieving cache:', error);
  }
  return data as TData;
}

/**
 * Same as useCache but outside components (e.g. services).
 * @param query
 * @param options
 */
export function readCache<TData extends AppCache, TVariables = OperationVariables>
(query: DocumentNode, options?: QueryHookOptions<TData, TVariables>): TData {
  const gqlClient = getGqlClient();
  return gqlClient.readQuery({ query, variables: options?.variables }, true) as TData;
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return (parts.pop() as string).split(';').shift() || null;
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export function isObject(obj: any): boolean {
  return typeof obj === 'object' && obj !== null;
}

export function wait(ms?: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

// Implementation details

function addTypeNames(data: RecursivePartial<AppCache>) {
  for (const key of Object.keys(data) as (keyof typeof data)[]) {
    const subObj = data[key] as any;
    const initialCacheObj = (defaultStore as AppCache)[key] as any;
    const newObjDoesNotHaveTypeName = !subObj || !subObj.__typename;
    const shouldHaveTypeNameInStore = isObject(subObj) || isObject(initialCacheObj);
    const typeNameIsMissingInStore = !isObject(initialCacheObj) || !initialCacheObj.__typename;
    if (newObjDoesNotHaveTypeName && shouldHaveTypeNameInStore && typeNameIsMissingInStore) {
      throw new Error(
        `You are trying to write in cache an object at key \`${key}\` but the default cache content (found in src/common/localStore.ts) does not have a __typename field. Apollo cache requires __typename to be provided with the data you write. writeCache utility adds it for you, but you need to add it in src/common/localStore.ts for that (check existing examples).`);
    }
    if (isObject(subObj) && isObject(initialCacheObj) && !subObj.__typename) {
      subObj.__typename = initialCacheObj.__typename;
    }
  }
  return data;
}

/**
 * Appends mutationResult to elts if it is not found in the list (loopup by id field). Only
 * works for a single mutation and a single inserted element. This method needs to be
 * generalized to support more elements / mutations.
 * @param elts
 * @param mutationResult
 */
export function optimisticInsert<T extends { id: string }>
(elts: T[], mutationResult: Mutation_Root | undefined): T[] {
  if (!mutationResult) {
    return elts;
  }
  const keys = Object.keys(mutationResult) as (keyof Mutation_Root)[];
  if (!keys.length) {
    return elts;
  }
  const mutRes = mutationResult[keys[0]] as any;
  if (!mutRes || !mutRes.returning || !mutRes.returning.length ||
    !mutRes.returning[0]) {
    return elts;
  }
  const newElt: T = mutRes.returning[0];
  for (const elt of elts) {
    if (elt.id === newElt.id) {
      return elts;
    }
  }
  return [...elts, newElt];
}
