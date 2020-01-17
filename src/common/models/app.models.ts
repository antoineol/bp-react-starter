// Add models (interfaces) that are used in more than one feature/module/service
import { OperationVariables } from '@apollo/react-common';
import { MutationFn } from 'react-offix-hooks/src/useOfflineMutation';

export type Mutator<TData = any, TVariables = OperationVariables> = MutationFn<TData, TVariables>;
