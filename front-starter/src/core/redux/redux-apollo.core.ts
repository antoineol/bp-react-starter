import { ApolloLink, FetchResult, NextLink, Observable, Operation } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createSlice } from '@reduxjs/toolkit';
import { FieldNode, FragmentDefinitionNode, OperationDefinitionNode } from 'graphql';
// import { Observable } from 'zen-observable-ts';
import { Query_Root, Subscription_Root } from '../../../generated/schema';
import { isObjectEmpty } from '../../common/utils/app.utils';

// Model

export type HasuraType = Omit<Query_Root & Subscription_Root, '__typename'>;

export interface HasuraModel {
  loadings: {
    [key: string]: boolean;
  };
  errors: {
    [key: string]: any;
  };
  values: {
    [key: string]: HasuraType | undefined;
  };
}

const hasuraSlice = createSlice({
  name: 'hasura',
  initialState: {} as HasuraModel,
  reducers: {
    setLoading: (state, action) => {
      const { field } = action.payload ?? {};
      state.loadings[field] = true;
      state.errors[field] = undefined;
    },
    setError: (state, action) => {
      const { field, value } = action.payload ?? {};
      state.loadings[field] = false;
      state.errors[field] = value;
      state.values[field] = undefined;
    },
    setValues: (state, action) => {
      const { field, value } = action.payload ?? {};
      state.loadings[field] = false;
      state.errors[field] = undefined;
      state.values[field] = value;
    },
  },
});

export const { setLoading, setError, setValues } = hasuraSlice.actions;

export const hasuraReducer = hasuraSlice.reducer;

// Inspired from: https://github.com/AdamYee/apollo-link-redux/blob/master/src/index.js
export class ReduxLink extends ApolloLink {
  request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
    const observer = forward?.(operation);
    const definition = getMainDefinition(operation.query);
    const opName = operation.operationName;
    const requestedTable = getRequestedTable(definition);
    const reduxField = opName || requestedTable;
    if (!isIntrospectionQuery(opName)) {
      setLoading({ field: reduxField });
    }
    observer?.subscribe(res => console.log('res:', res));
    console.log('observer?.map:', observer?.map);
    return observer?.map?.(result => {
      if (!isIntrospectionQuery(opName)) {
        if (result?.errors) {
          setError({ field: reduxField, value: result.errors });
        } else {
          const { __schema, ...data } = (result?.data || {}) as Query_Root & { __schema: any };
          // For now, we write the response as is in the store. If later we need to make the
          // distinction between multiple queries of the same table (e.g. different filters), we may
          // need to update the path in store including query information, as apollo is doing with
          // its own cache.
          if (!isObjectEmpty(data)) {
            setValues({ field: reduxField, value: data });
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
