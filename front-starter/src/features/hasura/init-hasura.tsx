import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { useAuth0 } from '@auth0/auth0-react';
import React, { FC, memo, useEffect, useMemo, useRef } from 'react';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Loading } from '../../common/components/Loading';
import { handleError } from '../../common/services/error.service';
import { env } from '../../environment/env';
import { getToken } from '../auth/get-auth0-token';

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
  // TODO a websocket connection is immediately closed (amongst 2, locally). To remove?
  //  Consider creating the connection only after the authentication is completed by
  //  restructuring the components rendered.

  // This code attempts to close the websocket connection in case of sign out.
  // It is nice to have since a sign out is typically followed by a page refresh.
  const { isAuthenticated } = useAuth0();
  const sub = useRef<SubscriptionClient>();
  useEffect(() => {
    if (!isAuthenticated && sub.current) {
      console.log('Close websocket connections');
      // sub.current.unsubscribeAll();
      sub.current.close();
      // sub.current = undefined;
    }
    return () => {
      console.log('Close websocket connections');
      sub.current?.close();
    };
  }, [isAuthenticated]);

  const client = useMemo(() => {
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

    // TODO required to close the connection (above commented code)
    sub.current = (wsLink as any).subscriptionClient;
    if (!sub.current) throw new Error('subscriptionClient falsy; this is not supposed to happen.');

    // const subscriptionClient = sub.current;
    // subscriptionClient.onConnecting(() => console.log('onConnecting'));
    // subscriptionClient.onConnected(() => console.log('onConnected'));
    // subscriptionClient.onReconnecting(() => console.log('onReconnecting'));
    // subscriptionClient.onReconnected(() => console.log('onReconnected'));
    // subscriptionClient.onDisconnected(() => console.log('onDisconnected'));
    // subscriptionClient.onError((val: any) => console.log('onError', val));

    return new ApolloClient({
      // link: ApolloLink.from([new ReduxLink(), wsLink]),
      link: ApolloLink.from([wsLink]),
      // link: wsLink,
      cache: new InMemoryCache({ addTypename: true }),
    });
  }, []);
  return <ApolloProvider client={client}>
    {children}
  </ApolloProvider>;
});

// function createApolloClient() {
//   console.log('createApolloClient');
//   return new ApolloClient({
//     link: new WebSocketLink({
//       uri: `${env.hasuraWs}/graphql`,
//       options: {
//         reconnect: true,
//         // lazy: true, // Wait for first subscription to open the ws connection
//         connectionParams: async () => ({ headers: { Authorization: `Bearer ${await getToken()}`
// } }), // connectionParams: { headers: { Authorization: `Bearer ${token}` } }, }, }), cache: new
// InMemoryCache(), }); }
