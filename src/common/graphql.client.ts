import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, FetchResult, fromPromise, NextLink, Operation } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { buildDelayFunction } from 'apollo-link-retry/lib/delayFunction';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloOfflineClient } from 'offix-client';
import Observable from 'zen-observable-ts';
import { addJwtToHeaders, showSignIn } from '../auth/auth.service';
import { env } from '../environment/env';
import { defaultStore } from './models/defaultStore';

const delayOptions = {
  initial: 500,
  max: 60000,
  jitter: true,
};

const retryLink = new RetryLink({
  delay: (count: number, operation: Operation, e: any): number => {
    const code = e && e.extensions && e.extensions.code;
    const c = code === 'start-failed' ? 1 : count;
    return buildDelayFunction(delayOptions)(c, operation, e);
  },
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    console.error('graphQLErrors:', graphQLErrors);
    for (const err of graphQLErrors) {
      const code = err.extensions?.code;
      if (code === 'invalid-jwt'
        || (code === 'invalid-headers' && err.message.includes('Missing Authorization header'))) {
        return reauthAndRetry(operation, forward);
      }
    }
  }
  if (networkError) {
    const code = (networkError as any)?.extensions?.code;
    if (code === 'start-failed') {
      return reauthAndRetry(operation, forward);
    }
    console.error('[Network error]:', networkError);
  }
});

const authLink = setContext(async (_, { headers }) =>
  ({ headers: await addJwtToHeaders(headers) }));

const wsLink = new WebSocketLink({
  uri: `${env.hasuraWs}/graphql`,
  options: {
    reconnect: true,
    lazy: true,
    // reconnectionAttempts: 10,
    connectionParams: async () => ({ headers: await addJwtToHeaders({}) }),
  } as any,
});

const cache = new InMemoryCache({
  freezeResults: true,
});
const gqlClient = new ApolloOfflineClient({
  cache,
  link: ApolloLink.from([retryLink, errorLink, authLink, wsLink]),
  assumeImmutableResults: true,
  // {} So that cache access does not run resolvers functions. Avoids irrelevant network
  // errors when accessing local cache (source: Apollo doc and PR).
  resolvers: {},
});
gqlClient.writeData({ data: defaultStore });
gqlClient.onResetStore(() => cache.writeData({ data: defaultStore }) as any);

export function getGqlClient() {
  return gqlClient;
}

// Utilities

export function resetWsConnection() {
  // Reset the WS connection for it to carry the new JWT.
  (wsLink as any).subscriptionClient.close(false, false);
}

function reauthAndRetry(operation: Operation, forward: NextLink): Observable<FetchResult> {
  return fromPromise(showSignIn())
    .flatMap(() => {
      return forward(operation);
    });
}
