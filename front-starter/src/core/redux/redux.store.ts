import { configureStore } from '@reduxjs/toolkit';
import { apiReducer } from '../../views/home/api.redux';
import { countReducer } from '../../views/home/count.service2';
import { ReducerToAppState } from './redux.models';

const reducer = {
  counter: countReducer,
  api: apiReducer,
};

export type AppStateModel = ReducerToAppState<typeof reducer>

export const store = configureStore({ reducer });

/**
 * Dispatcher to use in a context that has no dedicated dispatcher, i.e. the store is unknown.
 * Example: use it in a utility function.
 * Don't: use in component (use `useAppDispatch` instead), use in a saga (use `dispatchSaga`
 * instead)
 */
export function dispatchOther<T, U>(type: T, payload?: U) {
  store.dispatch({ type, payload });
}
