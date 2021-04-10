import { createSelector, OutputSelector } from 'reselect';
import { AppStateModel } from './redux.store';

export type SelectorReturnType<T extends keyof AppStateModel, R> =
  OutputSelector<AppStateModel, R, (res: AppStateModel[T]) => R>;

export function createAppSelector<T extends keyof AppStateModel, TransfoRes>
(reducerKey: T, selector: (value: AppStateModel[T]) => TransfoRes):
  SelectorReturnType<T, TransfoRes> {
  return createSelector(
    (state: AppStateModel) => state[reducerKey],
    // createRootSelector(reducerKey),
    // state => {
    //   let value: AppStateModel[T] | TransfoRes = state;
    //   value = selector(value) as TransfoRes;
    //   return value;
    // },
    selector,
  );
}
