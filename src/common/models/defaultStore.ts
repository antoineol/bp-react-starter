// Must have static values only. Dynamic values should be written separately in related services.
// Also update schema (localStore.graphql in same directory).
// Ensure types are set when required with cast because they will be used for cache functions.
export const defaultStore = {
  jwt: null as string | null,
  home: {
    count: 1,
    __typename: 'Home',
  },
  features: {
    queryJsonPlaceholder: false,
    __typename: 'Features',
  },
};

export type AppCache = typeof defaultStore;

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};
