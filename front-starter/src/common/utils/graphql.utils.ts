export const foo = true;
// import { OperationVariables } from 'apollo-client';
// import { Observable } from 'apollo-client/util/Observable';
// import { DocumentNode } from 'graphql';
// import { Query_Root, Subscription_Root } from '../../../generated/schema';
// import { getGqlClient } from '../graphql.client';
//
// // Do we still need those utilities? Maybe to request API in services when initializing some of
// // them? This is currently done in HTTP but may be moved to GraphQL.
//
// /**
//  * Sends a GraphQL request to the app API.
//  * @param query the GraphQL query. Use gql`query { ... }` syntax to build it.
//  */
// export async function apiQuery<T = Query_Root, TVariables = OperationVariables>(
//   query: DocumentNode): Promise<T> {
//   const gqlClient = getGqlClient();
//   const { data, errors } = await gqlClient.query<T, TVariables>({ query });
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
