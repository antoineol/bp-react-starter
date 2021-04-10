import { ApolloError, gql, useApolloClient, useQuery } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { SubscriptionHookOptions } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql';
import { useEffect } from 'react';
// import { FetchPolicy, OperationVariables } from 'apollo-client';
// import { Observable } from 'apollo-client/util/Observable';
// import { Query_Root, Subscription_Root } from '../../../generated/schema';
// import { getGqlClient } from '../graphql.client';
//
// // Do we still need those utilities? Maybe to request API in services when initializing some of
// // them? This is currently done in HTTP but may be moved to GraphQL.
//
// /**
//  * Sends a GraphQL request to the app API.
//  * @param query the GraphQL query. Use gql`query { ... }` syntax to build it.
//  * @param variables
//  * @param disableNetworkOnly
//  */
// export async function apiQuery<T = any, TVariables = OperationVariables>(
//   query: DocumentNode, variables?: TVariables, disableNetworkOnly?: boolean): Promise<T> {
//   const gqlClient = getGqlClient();
//   const options = disableNetworkOnly ? { query, variables } :
//     { query, variables, fetchPolicy: 'network-only' as FetchPolicy };
//   const { data, errors } = await gqlClient.query<T, TVariables>(options);
//   if (errors) {
//     throw errors;
//   }
//   return data;
// }
//
// export async function apiMutate<T = Query_Root, TVariables = OperationVariables>(
//   mutation: DocumentNode, variables?: TVariables): Promise<T | null | undefined> {
//   const gqlClient = getGqlClient();
//   const { data, errors } = await gqlClient.mutate<T, TVariables>({ mutation, variables });
//   if (errors) {
//     throw errors;
//   }
//   return data;
// }
//
// export function apiSubscribe<T = Subscription_Root, TVariables = OperationVariables>(
//   query: DocumentNode): Observable<T | null | undefined> {
//   const gqlClient = getGqlClient();
//   return gqlClient.subscribe<T, TVariables>({ query }).map((res => res.data));
// }
//
// // Not used yet but those utilities could be interesting if we need to manipulate
// // gql queries later.
// export function isSubscription(subscription: DocumentNode): boolean {
//   return !!subscription.definitions.find(def => {
//     const op = def as OperationDefinitionNode;
//     return op.kind === 'OperationDefinition' && op.operation === 'subscription';
//   });
// }

/**
 * Like useSubscription, but with an immediate initial emit. This is implemented by using
 * useQuery + subscribeToMore.
 * Assumption (true for Hasura): the data returned by the subscription has exactly the same
 * format as the initial query and can fully replace it.
 * @see useSubscription
 */
export function useSub<TData = any, TVariables = OperationVariables>(subscription: DocumentNode | TypedDocumentNode<TData, TVariables>,
                                                                     options?: SubscriptionHookOptions<TData, TVariables>): {
  variables: TVariables | undefined;
  loading: boolean;
  data?: TData | undefined;
  error?: ApolloError | undefined;
} {
  const query = subscriptionToQuery(subscription);

  const { loading, error, data, subscribeToMore, variables } = useQuery<TData, TVariables>(query,
    options);
  // TODO optimistic UI update could be handled here?
  // https://github.com/hasura/graphql-engine/issues/2317#issuecomment-527330779
  // https://github.com/apollographql/apollo-client/issues/5267
  useEffect(() => subscribeToMore({
    document: subscription,
    variables: options?.variables,
    updateQuery: (prev, { subscriptionData }) =>
      subscriptionData?.data ? subscriptionData.data : prev,
  }), [options?.variables, subscribeToMore, subscription]);
  return { loading, error, data, variables };
}

export function useReduxSub<TData = any, TVariables = OperationVariables>(subscription: DocumentNode | TypedDocumentNode<TData, TVariables>,
                                                                          options?: SubscriptionHookOptions<TData, TVariables>) {
  const client = useApolloClient();
  useEffect(() => {
    const sub = client.subscribe({ query: subscription, ...options }).subscribe({});
    return () => sub.unsubscribe();
  }, [client, options, subscription]);
}

// export function useReduxSub2<TData = any, TVariables = OperationVariables>(subscription:
// DocumentNode | TypedDocumentNode<TData, TVariables>, options?: SubscriptionHookOptions<TData,
// TVariables>) { const client = useApolloClient(); const query =
// subscriptionToQuery(subscription); useEffect(() => { const { subscribe } = client.watchQuery({
// query, ...options }) const sub = subscribe({}); return () => sub.unsubscribe(); }, [client,
// options, query, subscription]); }  export function useReduxSub3<TData = any, TVariables =
// OperationVariables>(subscription: DocumentNode | TypedDocumentNode<TData, TVariables>, options?:
// SubscriptionHookOptions<TData, TVariables>) { const client = useApolloClient(); const query =
// subscriptionToQuery(subscription); useEffect(() => { // const res = client.watchQuery({ query,
// ...options }); // const sub = Observable.from(res).subscribe({}); // const sub =
// Observable.from(res).subscribe({}); // const { subscribeToMore } = res; const { subscribe } =
// client.watchQuery({ query, ...options }); const sub = subscribe((res) => {
// console.log('subscribe foo', res); }); // const unsub = subscribeToMore({ //   document:
// subscription, //   variables: options?.variables, //   updateQuery: (prev, { subscriptionData })
// => //     subscriptionData?.data ? subscriptionData.data : prev, // }); // return () =>
// {sub.unsubscribe(); /*unsub()*/}; }, [client, options, query, subscription]); }

export function subscriptionToQuery(subscription: DocumentNode): DocumentNode {
  if (!subscription.loc) return subscription;
  return gql(subscription.loc.source.body.replace('subscription', 'query'));

  // KO:
  // return {
  //   ...subscription, definitions: subscription.definitions.map((def) => {
  //     const op = def as OperationDefinitionNode;
  //     if (op.kind === 'OperationDefinition' && op.operation === 'subscription') {
  //       return { ...op, operation: 'query' };
  //     }
  //     return op;
  //   }),
  // };
}
