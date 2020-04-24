import { Store } from 'redux';
import { AppStoreModel } from './redux.models';

export type StoreType = Store<AppStoreModel, any /* SimpleAction? */> & { dispatch: {} };

let store: StoreType;

export function getStore() {
  return store;
}

export function setStoreAndHistory(newStore: StoreType) {
  store = newStore;
}
