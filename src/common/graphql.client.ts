import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { env } from '../environment/env';

const httpLink = createHttpLink({
  uri: `${env.apiPath}/graphql`,
});

export const gqlClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
