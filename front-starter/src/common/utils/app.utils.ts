import { useCallback } from "react";
import { Mutation_Root } from "../../../generated/schema";
import { handleError } from "../services/error.service";

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
    } catch (e: any) {
      handleError(e);
      if (setError && (!e || e.message !== 'CANCELED')) setError(e);
    } finally {
      if (setLoading) setLoading(false);
    }
  }, [handler, setError, setLoading]);
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

export function isObjectEmpty(obj: object) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function wait(ms?: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
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
