import { ApolloLink } from 'apollo-link';
import { FetchResult, NextLink, Operation } from 'apollo-link/lib/types';
import { getMainDefinition } from 'apollo-utilities';
import { FieldNode, FragmentDefinitionNode, OperationDefinitionNode } from 'graphql';
import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import Observable from 'zen-observable-ts';
import { Query_Root, Subscription_Root } from '../../../generated/schema';
import { isObjectEmpty } from '../../common/utils/app.utils';
import { StoreOf } from '../redux/redux.models';
import { ActionWithPayload, dispatchOther, selectState } from '../redux/redux.utils';

// Model

// To add to src/common/redux.models.ts

export const REDUX_APOLLO_REDUCER = 'hasura';

type ApolloType = Omit<Query_Root & Subscription_Root, '__typename'>;

export interface ReduxApolloModel {
  [key: string]: ApolloType;
}

type ReduxApolloStore = StoreOf<ReduxApolloModel>;

// Actions

enum ReduxApolloAT {
  Loading = '__ReduxApolloAT__Loading',
  Error = '__ReduxApolloAT__Error',
  UpdateStore = '__ReduxApolloAT__UpdateStore',
}

type ReduxApolloAction = ActionWithPayload<ReduxApolloAT, { field: string, value?: any }>;

// Selector

/**
 *
 * @param table Name of the table to select. Auto-completion gives the list of choices. It should
 * match the table selected in graphql request.
 * @param graphQlRequestName In case multiple requests of the same table exist, you should name
 * your graphql requests (e.g. `query myAuthors { ... }`; myAuthors is the request name). This
 * argument is the name of the request which results should be fetched. If you don't provide a
 * name in your GraphQL request, it defaults to the first table name you are fetching and this
 * argument is optional.
 */
export function selectApollo<F extends keyof ReduxApolloModel, K extends keyof ApolloType>
(table: K, graphQlRequestName?: F) {
  const f = graphQlRequestName || table;
  return selectState(REDUX_APOLLO_REDUCER, f,
    root => (root as ApolloType)?.[table] as ApolloType[K] | undefined);
}

// Reducer

const initialState: ReduxApolloStore = fromJS({} as ReduxApolloModel);

// To add to src/core/app.reducers.ts
export const apolloReducer: Reducer<ReduxApolloStore, ReduxApolloAction> =
  (state = initialState, { type, payload }) => {
    const { field, value } = payload ?? {};
    switch (type) {
      case ReduxApolloAT.UpdateStore:
        return state.set(field, value);
      default:
        return state;
    }
  };

// Inspired from: https://github.com/AdamYee/apollo-link-redux/blob/master/src/index.js
export class ReduxLink extends ApolloLink {
  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    const observer = forward?.(operation);
    const definition = getMainDefinition(operation.query);
    const opName = operation.operationName;
    const requestedTable = getRequestedTable(definition);
    const reduxField = opName || requestedTable;
    if (!isIntrospectionQuery(opName)) {
      dispatchOther(ReduxApolloAT.Loading, { field: reduxField });
    }
    return observer?.map(result => {
      if (!isIntrospectionQuery(opName)) {
        if (result?.errors) {
          dispatchOther(ReduxApolloAT.Error, { field: reduxField, value: result.errors });
        } else {
          const { __schema, ...data } = (result?.data || {}) as Query_Root & { __schema: any };
          // For now, we write the response as is in the store. If later we need to make the
          // distinction between multiple queries of the same table (e.g. different filters), we may
          // need to update the path in store including query information, as apollo is doing with
          // its own cache.
          if (!isObjectEmpty(data)) {
            dispatchOther(ReduxApolloAT.UpdateStore, { field: reduxField, value: data });
          }
        }
      }
      return result;
    }) || null;
  }
}

function isIntrospectionQuery(name: string) {
  return name === 'IntrospectionQuery';
}

function getRequestedTable(definition: OperationDefinitionNode | FragmentDefinitionNode) {
  return (definition.selectionSet.selections[0] as FieldNode)?.name.value;
}

// "Full" variant if we want to also have loading and errors in redux store. Not that interesting
// since those information can be read from useQuery and useSubscription, which work well.
// Current usage of redux should be limited to reading local state for data already loaded.

// export interface ReduxApolloFullModel {
//   [key: string]: {
//     loading?: boolean;
//     error?: ReadonlyArray<GraphQLError>;
//     // data?: ValueOf<ApolloType>;
//     data?: ApolloType;
//   };
// }
//
// type ReduxApolloFullStore = StoreOf<ReduxApolloFullModel>;
//
// // Types variants, adapt return type based on function call signature
// export function selectApolloFull<F extends keyof ReduxApolloFullModel, K extends keyof
// ApolloType> (field: F, state: 'loading'): SelectorReturnType<typeof REDUX_APOLLO_REDUCER,
// boolean>; export function selectApolloFull<F extends keyof ReduxApolloFullModel, K extends keyof
// ApolloType> (field: F, state: 'data', key: K): SelectorReturnType<typeof REDUX_APOLLO_REDUCER,
// ApolloType[K]>; export function selectApolloFull<F extends keyof ReduxApolloFullModel, K extends
// keyof ApolloType> (field: F, state: 'error'): SelectorReturnType<typeof REDUX_APOLLO_REDUCER,
// ReadonlyArray<GraphQLError>>;  // Implementation export function selectApolloFull<F extends
// keyof ReduxApolloFullModel, K extends keyof ApolloType> (field: F, state: 'loading' | 'data' |
// 'error', key?: K) { if (key) { return selectState(REDUX_APOLLO_REDUCER, field, root =>
// root?.getIn([state, key]) as ApolloType[K]); } else { return selectState(REDUX_APOLLO_REDUCER,
// field, root => root?.get(state) as boolean | ReadonlyArray<GraphQLError>); } }  const
// initialStateFull: ReduxApolloFullStore = fromJS({} as ReduxApolloFullModel);  export const
// apolloFullReducer: Reducer<ReduxApolloFullStore, ReduxApolloAction> = (state = initialStateFull,
// { type, payload }) => { const { field, value } = payload ?? {}; switch (type) { case
// ReduxApolloAT.Loading: return state .setIn([field, 'loading'], true) .removeIn([field,
// 'error']); case ReduxApolloAT.Error: return state .setIn([field, 'loading'], false)
// .setIn([field, 'error'], value); case ReduxApolloAT.UpdateStore: return state .setIn([field,
// 'loading'], false) .setIn([field, 'data'], value); default: return state; } };
