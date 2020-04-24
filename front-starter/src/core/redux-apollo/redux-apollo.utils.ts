import { OperationVariables } from '@apollo/react-common';
import { SubscriptionHookOptions } from '@apollo/react-hooks/lib/types';
import { DocumentNode } from 'graphql';
import { useEffect } from 'react';
import { getGqlClient } from '../../common/graphql.client';

// Apollo requests utils we can use in combination with selectors below

function noOp() {
}

/**
 * Starts a subscription when the component is mounted and unsubscribe when the component is
 * unmounted. To access subscription data, use selector `selectApollo` define in the same file.
 * This is a replacement for useSubscription that don't trigger component re-render when
 * loading/data/error change. Selectors are responsible for triggering re-renders.
 *
 * Only use this method when you're not happy with the existing useSubscription and would like
 * to use redux selectors instead to get loading and errors.
 */
export function useSimpleSubscription<TData = any,
  TVariables = OperationVariables>(subscription: DocumentNode,
                                   options?: SubscriptionHookOptions<TData, TVariables>): void {
  useEffect(() => {
    const client = getGqlClient();
    const sub = client.subscribe<TData, TVariables>(
      { query: subscription, variables: options?.variables, fetchPolicy: options?.fetchPolicy })
      .subscribe(noOp);
    return () => sub.unsubscribe();
  }, []);
}

// For queries, useQuery works well, no need to use
