import { RouterState } from 'connected-react-router/immutable';
import { createSelector } from 'reselect';
import { AppStore, StoreOf } from './app.models';
import { toJS } from './app.utils';

// Route selector

export type RouterStore = StoreOf<RouterState>;

// Don't change the value, it's used by connected-react-router
export const ROUTER_REDUCER = 'router';

function selectRouter(state: AppStore): RouterStore {
  return state.get(ROUTER_REDUCER);
}

export function selectLocation() {
  return createSelector(selectRouter, routerState =>
    toJS(routerState.get('location')),
  );
}
