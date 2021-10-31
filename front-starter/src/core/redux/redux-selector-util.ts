import { createSelector, OutputSelector } from 'reselect';
import { RootState } from './redux.store';

export type SelectorReturnType<T extends keyof RootState, R> = OutputSelector<
  RootState,
  R,
  (res: RootState[T]) => R
>;

// Is it worth it? Now we use redux toolkit, the syntax is much simpler.
// It's not even sure perf are better with this wrapper. So should we drop it?
export function createAppSelector<T extends keyof RootState, TransfoRes>(
  reducerKey: T,
  selector: (value: RootState[T]) => TransfoRes
): SelectorReturnType<T, TransfoRes> {
  return createSelector((state: RootState) => state[reducerKey], selector);
}
