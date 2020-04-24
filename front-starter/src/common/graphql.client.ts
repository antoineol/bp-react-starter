import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, FetchResult, fromPromise, NextLink, Operation } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { buildDelayFunction } from 'apollo-link-retry/lib/delayFunction';
import { WebSocketLink } from 'apollo-link-ws';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ZenObservable from 'zen-observable-ts';
import { ReduxLink } from '../core/redux-apollo/redux-apollo.core';
import { env } from '../environment/env';
import { addJwtToHeaders, fetchNewJwt } from '../features/auth/auth.service';
import { defaultStore } from './localStore';

let gqlClient: ApolloClient<NormalizedCacheObject>;
let wsLink: WebSocketLink;

export enum WsConnectionStatus {offline, connecting, connected}

const connectionStatus = new ReplaySubject<WsConnectionStatus>(1);

function initGqlClient() {
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
      console.error('[GraphQL Errors]:', graphQLErrors);
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
      console.error('[Network error]:', networkError);
      if (code === 'start-failed') {
        return reauthAndRetry(operation, forward);
      }
    }
  });

  const authLink = setContext(async (_, { headers }) =>
    ({ headers: await addJwtToHeaders(headers) }));

  wsLink = new WebSocketLink({
    uri: `${env.hasuraWs}/graphql`,
    options: {
      reconnect: true,
      lazy: true,
      // reconnectionAttempts: 999, // Infinite if not provided
      connectionParams: async () => ({ headers: await addJwtToHeaders({}) }),
    },
  } as WebSocketLink.Configuration);

  const wsSubscriptionClient = (wsLink as any).subscriptionClient as SubscriptionClient;
  wsSubscriptionClient.onConnecting(val => connectionStatus.next(WsConnectionStatus.connecting));
  wsSubscriptionClient.onConnected(val => connectionStatus.next(WsConnectionStatus.connected));
  wsSubscriptionClient.onReconnecting(val => connectionStatus.next(WsConnectionStatus.connecting));
  wsSubscriptionClient.onReconnected(val => connectionStatus.next(WsConnectionStatus.connected));
  wsSubscriptionClient.onDisconnected(val => connectionStatus.next(WsConnectionStatus.offline));
  wsSubscriptionClient.onError(val => connectionStatus.next(WsConnectionStatus.offline));

  // TODO consider cache & network + dedupe:
  //  https://github.com/apollographql/apollo-cache-persist/issues/53#issuecomment-394733564
  const cache = new InMemoryCache({
    freezeResults: true,
  });
  gqlClient = new ApolloClient({
    cache,
    link: ApolloLink.from(
      [new ReduxLink(), retryLink, errorLink, authLink, wsLink]),
    assumeImmutableResults: true,
    // {} So that cache access does not run resolvers functions. Avoids irrelevant network
    // errors when accessing local cache (source: Apollo doc and PR).
    resolvers: {},
  });
  gqlClient.writeData({ data: defaultStore });
  gqlClient.onResetStore(() => cache.writeData({ data: defaultStore }) as any);

}

export function getGqlClient() {
  if (!gqlClient && !env.isJest) {
    initGqlClient();
  }
  return gqlClient;
}

export function getWsConnectionStatus(): Observable<WsConnectionStatus> {
  return connectionStatus.asObservable();
}

// Utilities

export function resetWsConnection() {
  // Reset the WS connection for it to carry the new JWT.
  return (wsLink as any).subscriptionClient.close(false, false);
}

function reauthAndRetry(operation: Operation, forward: NextLink): ZenObservable<FetchResult> {
  return fromPromise(fetchNewJwt())
    .flatMap(() => {
      return forward(operation);
    });
}
