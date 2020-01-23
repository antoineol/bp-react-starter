import { MockedResponse } from '@apollo/react-testing';
import { Query_Root } from '../../../hasura/gen/types';
import { AUTHORS_SUB } from '../../profile/profile.service';
import { AppCache } from '../localStore';
import { GET_JSON_PL_REMOTE } from '../services/features.service';

// Add mock data here for graphql queries.
export const mockGqlQueries: MockedResponse[] = [{
  request: { query: GET_JSON_PL_REMOTE, variables: {} },
  result: {
    data: {
      features: {
        queryJsonPlaceholder: true,
      },
    } as Query_Root,
  },
}, {
  request: { query: AUTHORS_SUB },
  result: {
    data: {
      author: [{
        id: '123',
        name: 'John',
      }],
    } as Query_Root,
  },
}];

// Data to insert by default in the cache for tests only
export const defaultStoreAdditionsForTests: Partial<AppCache> = {};
