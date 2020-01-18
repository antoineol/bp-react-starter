// Must have static values only. Dynamic values should be written separately in related services.
// Also update schema (localStore.graphql in same directory).
// Ensure types are set when required with cast because they will be used for cache functions.
export const defaultStore = {
  jwt: undefined as string | undefined,
};

export type AppCache = typeof defaultStore;
