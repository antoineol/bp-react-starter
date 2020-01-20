// Add models (interfaces) that are used in more than one feature/module/service
import { ExecutionResult, MutationFunctionOptions, OperationVariables } from '@apollo/react-common';

export type Mutator<TData = any, TVariables = OperationVariables> = (options?: MutationFunctionOptions<TData, TVariables>) => Promise<ExecutionResult<TData>>;
