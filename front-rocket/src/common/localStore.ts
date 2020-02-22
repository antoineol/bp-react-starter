import { Query_Root } from '../../hasura/gen/types';

// Must have static values only. Dynamic values should be written separately in related services.
// Also update schema (localStore.graphql in same directory).
// Ensure types are set when required with cast because they will be used for cache functions.
export const defaultStore = {
  jwt: null as string | null,
  home: {
    count: 1,
    __typename: 'Home',
  },
};

export type AppCache = typeof defaultStore & Query_Root;
