import { ApolloProvider } from '@apollo/react-common';
import { CircularProgress } from '@material-ui/core';
import { ApolloOfflineClient } from 'offix-client';
import React, { FC, useEffect, useState } from 'react';
import { ApolloOfflineProvider } from 'react-offix-hooks';

interface Props {
  client: ApolloOfflineClient;
}

export const ApolloInit: FC<Props> = ({ client, children }) => {
  const [initialized, setInitialized] = useState(false);

  // initialize the offix client and set the apollo client
  useEffect(() => {
    client.init().then(() => setInitialized(true));
  }, [client]);
  if (!initialized) {
    return <CircularProgress />;
  }
  return <ApolloOfflineProvider client={client}>
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  </ApolloOfflineProvider>;
};
