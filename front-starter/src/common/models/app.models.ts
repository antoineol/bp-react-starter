// Add models (interfaces) that are used in more than one feature/module/service
import { MutationTuple } from '@apollo/client';
import { OperationVariables } from '@apollo/react-common';

export type Mutator<TData = any, TVariables = OperationVariables> = MutationTuple<TData, TVariables>[0];

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
