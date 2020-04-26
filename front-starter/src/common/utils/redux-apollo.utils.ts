import { Record } from 'immutable';
import { ApolloType, REDUX_APOLLO_REDUCER } from '../../core/redux/redux-apollo.core';
import { StoreEntry } from '../../core/redux/redux.models';
import { createAppSelector } from '../../core/redux/redux.utils';

/**
 * @param table Name of the table to select. Auto-completion gives the list of choices. It should
 * match the table selected in graphql request.
 * @param selector a function taking as argument the table entries and returning what needs to
 * be extracted in this selector. Keep in mind you are manipulating immutablejs objects.
 * @param graphQlRequestName In case multiple requests of the same table exist, you should name
 * your graphql requests (e.g. `query myAuthors { ... }`; myAuthors is the request name). This
 * argument is the name of the request which results should be fetched. If you don't provide a
 * name in your GraphQL request, it defaults to the first table name you are fetching and this
 * argument is optional.
 */
export function createApolloSelector<K extends keyof ApolloType, Selected>
(table: K, selector: (entries: StoreEntry<ApolloType[K]>) => Selected,
 graphQlRequestName?: string) {
  const f = graphQlRequestName || table;
  return createAppSelector(REDUX_APOLLO_REDUCER, f,
    (root: Record<ApolloType>) => selector(root.get(table) as StoreEntry<ApolloType[K]>));
}

/**
 * @param table Name of the table to select. Auto-completion gives the list of choices. It should
 * match the table selected in graphql request.
 * @param graphQlRequestName In case multiple requests of the same table exist, you should name
 * your graphql requests (e.g. `query myAuthors { ... }`; myAuthors is the request name). This
 * argument is the name of the request which results should be fetched. If you don't provide a
 * name in your GraphQL request, it defaults to the first table name you are fetching and this
 * argument is optional.
 */
export function createApolloSelectorTopLevel<K extends keyof ApolloType>
(table: K, graphQlRequestName?: string) {
  const f = graphQlRequestName || table;
  return createAppSelector(REDUX_APOLLO_REDUCER, f, root => root.get(table));
}

// /**
//  * Starts a subscription when the component is mounted and unsubscribe when the component is
//  * unmounted. To access subscription data, use selector `selectApollo` define in the same file.
//  * This is a replacement for useSubscription that don't trigger component re-render when
//  * loading/data/error change. Selectors are responsible for triggering re-renders.
//  *
//  * Only use this method when you're not happy with the existing useSubscription and would like
//  * to use redux selectors instead to get loading and errors.
//  */
// export function useSimpleSubscription<TData = any,
//   TVariables = OperationVariables>(subscription: DocumentNode,
//                                    options?: SubscriptionHookOptions<TData, TVariables>): void {
//   useEffect(() => {
//     const client = getGqlClient();
//     const sub = client.subscribe<TData, TVariables>(
//       { query: subscription, variables: options?.variables, fetchPolicy: options?.fetchPolicy })
//       .subscribe(noOp);
//     return () => sub.unsubscribe();
//   }, []);
// }
//
// function noOp() {
// }
