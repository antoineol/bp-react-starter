import { MockedResponse } from '@apollo/react-testing';
import { Mutation_Root, Query_Root } from '../../generated/schema';
import { AppCache } from '../common/localStore';
import { GET_JSON_PL_REMOTE } from '../common/services/features.service';
import { ADD_AUTHOR, AUTHORS_SUB } from '../views/profile/profile.service';

export const addAuthorMock = {
  request: { query: ADD_AUTHOR },
  result: jest.fn(() => ({
    data: {
      insert_author: {
        affected_rows: 1,
      },
    } as Mutation_Root,
  })),
};

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
        name: 'Jane',
      }],
    } as Query_Root,
  },
}, addAuthorMock];

// Data to insert by default in the cache for tests only
export const defaultStoreAdditionsForTests: Partial<AppCache> = {};
