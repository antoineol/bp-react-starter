import { Query_Root } from '../../generated/schema';
import { JwtClaims } from '../features/auth/auth.model';

// Must have static values only. Dynamic values should be written separately in related services.
// Also update schema (localStore.graphql in same directory).
// Ensure types are set when required with cast because they will be used for cache functions.
export const defaultStore = {
  jwt: null as string | null,
  home: {
    count: 1,
    __typename: 'Home',
  },
  profile: {
    __typename: 'Profile',
  } as ({ __typename?: 'Profile' } & JwtClaims) | null,
};

// Application store
export type AppCache = typeof defaultStore & Query_Root;
