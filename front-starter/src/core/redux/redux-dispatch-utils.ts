import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { RootState } from './store';

// Wrapper to specify the type parameter of configureStore in below typing.
const csForType = (options: any) => configureStore<RootState>(options);
type Store = ReturnType<typeof csForType>;

let _store: Store | null = null;

export function setStoreForDispatch(store: Store) {
  _store = store;
}

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
  if (!_store) {
    throw new Error(
      'Trying to dispatch an action, but the store is not defined yet in redux-dispatch-utils.ts. Too early?'
    );
  }
  _store.dispatch(action);
}
