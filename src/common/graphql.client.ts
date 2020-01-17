import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, FetchResult, fromPromise, NextLink, Operation } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { buildDelayFunction } from 'apollo-link-retry/lib/delayFunction';
import { WebSocketLink } from 'apollo-link-ws';
import Observable from 'zen-observable-ts';
import { addJwtToHeaders, backgroundSignOut, signIn } from '../auth/auth.service';
import { env } from '../environment/env';

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

// TODO mutations through websocket: useful?
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    console.error('graphQLErrors:', graphQLErrors);
    for (const err of graphQLErrors) {
      const code = err.extensions?.code;
      if (code === 'invalid-jwt'
        || (code === 'invalid-headers' && err.message.includes('Missing Authorization header'))) {
        // TODO Update to not use redux store: either apollo cache (not clear) or a separate
        //  observable/promise system
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

const authLink = setContext((_, { headers }) =>
  ({ headers: addJwtToHeaders(headers) }));

const wsLink = new WebSocketLink({
  uri: `${env.hasuraWs}/graphql`,
  options: {
    reconnect: true,
    lazy: true,
    // reconnectionAttempts: 10,
    connectionParams: () => ({ headers: addJwtToHeaders({}) }),
  } as any,
});

// const httpLink = createHttpLink({
//   uri: `${env.hasuraPath}/graphql`,
//   // fetch: customFetch,
//   // headers: { 'Authorization': `Bearer ${jwt}` },
// });
//
// const link = split(({ query }) => {
//     const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
//     return kind === 'OperationDefinition' && operation === 'subscription';
//   },
//   wsLink,
//   httpLink,
// );

export const gqlClient = new ApolloClient({
  link: ApolloLink.from([retryLink, errorLink, authLink, wsLink]),
  cache: new InMemoryCache({
    freezeResults: true,
  }),
  assumeImmutableResults: true,
});

// Utilities

export function resetWsConnection() {
  // Reset the WS connection for it to carry the new JWT.
  (wsLink as any).subscriptionClient.close(false, false);
}

function reauthAndRetry(operation: Operation, forward: NextLink): Observable<FetchResult> {
  const reauthenticate = backgroundSignOut().then(() => signIn());
  return fromPromise(reauthenticate)
    .flatMap(() => {
      return forward(operation);
    });
}
