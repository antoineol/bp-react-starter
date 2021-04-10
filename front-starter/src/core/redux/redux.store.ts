import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { env } from '../../environment/env';
import { hasuraReducer } from '../../features/hasura/redux-apollo-slice';
import { apiReducer } from '../../views/home/api.redux';
import { countReducer } from '../../views/home/count.service';
import { ReducerToAppState } from './redux.models';

const reducer = {
  counter: countReducer,
  api: apiReducer,
  hasura: hasuraReducer,
};

export type AppStateModel = ReducerToAppState<typeof reducer>

export const store = configureStore({ reducer, devTools: env.isDev });

/**
 * Dispatcher to use in a context that has no dedicated dispatcher, i.e. the store is unknown.
 * Example: use it in a utility function.
 * Don't: use in component (use `useAppDispatch` instead), use in a saga (use `dispatchSaga`
 * instead)
 */
// export function dispatchOther<T, U>(type: T, payload?: U) {
//   store.dispatch({ type, payload });
// }
export function dispatchOther(action: AnyAction) {
  store.dispatch(action);
}

