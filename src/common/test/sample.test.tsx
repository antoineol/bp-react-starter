import { useQuery } from '@apollo/react-hooks';
import { MockedProvider } from '@apollo/react-testing';
import { render } from '@testing-library/react';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { flushAllPromises } from './test.utils';

// afterEach(cleanup);
const FEAT_QUERY = gql`{ features { queryJsonPlaceholder } }`;

interface FeaturesResponse {
  features: { queryJsonPlaceholder: boolean };
}

function TestUsersComponent() {
  const { data } = useQuery<FeaturesResponse>(FEAT_QUERY);
  if (!data) {
    return <>No data</>;
  }
  return <div>queryJsonPlaceholder: {data.features.queryJsonPlaceholder}</div>;
}

const usersMock = [
  {
    request: { query: FEAT_QUERY },
    result: {
      data: {
        features: {
          // __typename: 'Features',
          queryJsonPlaceholder: true,
        },
      },
    },
  },
];

const cache = new InMemoryCache({ addTypename: false });
describe('API: \'users\' query', () => {
  it('renders as snapshot', async () => {
    const { getByText } = render(
      <MockedProvider mocks={usersMock} addTypename={false} cache={cache} resolvers={{}}>
        <TestUsersComponent />
      </MockedProvider>,
    );
    await act(flushAllPromises);
    expect(getByText(/queryJsonPlaceholder/i)).toBeInTheDocument();
  });
});
