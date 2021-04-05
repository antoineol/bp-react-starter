import { ApolloClient, ApolloProvider, from, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { useAuth0 } from '@auth0/auth0-react';
import { Store } from '@reduxjs/toolkit';
import React, { FC, memo, MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { useStore } from 'react-redux';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Loading } from '../../common/components/Loading';
import { handleError } from '../../common/services/error.service';
import { env } from '../../environment/env';
import { getToken } from '../auth/get-auth0-token';
import { makeReduxLink } from './redux-apollo-link';

export const InitApolloProvider: FC = memo(({ children }) => {
  // Check when auth0 has finished its initialization
  const { isLoading, isAuthenticated } = useAuth0();
  const initRef = useRef(false);
  if (!initRef.current && !isLoading) {
    initRef.current = true;
  }
  const isAuth0Initialized = initRef.current;

  // As long as auth0 is initializing, we show a loader
  if (!isAuth0Initialized) return <Loading />;

  if (isAuthenticated) {
    return <InitApolloProvider2>{children}</InitApolloProvider2>;
  }
  return <>{children}</>;
});

const InitApolloProvider2: FC = memo(({ children }) => {
  // This code attempts to close the websocket connection in case of sign out.
  // It is nice to have since a sign out is typically followed by a page refresh.
  const { isAuthenticated } = useAuth0();
  const store = useStore();
  const subRef = useRef<SubscriptionClient>();
  useEffect(() => {
    if (!isAuthenticated && subRef.current) {
      console.log('Close websocket connections because of sign out');
      // sub.current.unsubscribeAll();
      subRef.current.close();
      // sub.current = undefined;
    }
    return () => {
      console.log('Close websocket connections because of InitApolloProvider2 unmount');
      // eslint-disable-next-line react-hooks/exhaustive-deps
      subRef.current?.close();
    };
  }, [isAuthenticated]);

  const client = useMemo(() => createApolloClient(subRef, store), [store]);
  return <ApolloProvider client={client}>
    {children}
  </ApolloProvider>;
});

function createApolloClient(subRef: MutableRefObject<SubscriptionClient | undefined>,
                            store: Store) {
  const wsLink = new WebSocketLink({
    uri: `${env.hasuraWs}/graphql`,
    options: {
      reconnect: true,
      timeout: 5000,
      // lazy: true, // Wait for first subscription to open the ws connection
      connectionParams: async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } }),
      connectionCallback: (error: any, result?: any) => {
        if (error) handleError(error);
      },
    },
  });

  // Required to close the connection (above commented code)
  subRef.current?.close();
  subRef.current = (wsLink as any).subscriptionClient;
  if (!subRef.current) throw new Error('subscriptionClient falsy; this is not supposed to happen.');

  // const subscriptionClient = sub.current;
  // subscriptionClient.onConnecting(() => console.log('onConnecting'));
  // subscriptionClient.onConnected(() => console.log('onConnected'));
  // subscriptionClient.onReconnecting(() => console.log('onReconnecting'));
  // subscriptionClient.onReconnected(() => console.log('onReconnected'));
  // subscriptionClient.onDisconnected(() => console.log('onDisconnected'));
  // subscriptionClient.onError((val: any) => console.log('onError', val));

  return new ApolloClient({
    link: from([makeReduxLink(store), wsLink]),
    cache: new InMemoryCache({ addTypename: true }),
    connectToDevTools: true,
  });
}
