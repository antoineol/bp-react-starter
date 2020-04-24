// Add models (interfaces) that are used in more than one feature/module/service
import { ExecutionResult, MutationFunctionOptions, OperationVariables } from '@apollo/react-common';

export type Mutator<TData = any, TVariables = OperationVariables> = (options?: MutationFunctionOptions<TData, TVariables>) => Promise<ExecutionResult<TData>>;

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

export interface Dict<T> {
  [key: string]: T;
}

export type ValueOf<T> = T[keyof T];
