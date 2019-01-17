import { Record } from 'immutable';

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
