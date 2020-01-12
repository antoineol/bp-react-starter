import { History } from 'history';
import { Store } from 'redux';
import { AppStoreModel } from '../common/app.models';

export type StoreType = Store<AppStoreModel, any /* SimpleAction? */> & { dispatch: {} };

let history: History;
let store: StoreType;

export function getStoreAndHistory() {
  return { store, history };
}

export function setStoreAndHistory(newStore: StoreType, newHistory: History) {
  store = newStore;
  history = newHistory;
}
