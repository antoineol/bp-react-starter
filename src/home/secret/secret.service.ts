import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { createSelector } from 'reselect';
import { AppStore, StoreOf } from '../../common/app.models';
import { toJS } from '../../common/app.utils';

// Model

export interface SecretModel {
  show: boolean;
}

export type SecretStore = StoreOf<SecretModel>;

export const SECRET_REDUCER = 'secret';

// Actions

export enum SecretAT {
  Show = 'SecretATShow',
}

export interface ShowAction {
  type: SecretAT.Show;
  show: boolean;
}

export type SecretActions = ShowAction;

// Action dispatcher bount to allowed action types for this service

export const dispatchSecret = (action: SecretActions) => action;

// Selectors

function selectSecretState(state: AppStore): SecretStore {
  return state.get(SECRET_REDUCER);
}

export function selectShowSecret() {
  return createSelector(
    selectSecretState,
    secret => toJS(secret.get('show')),
  );
}

// Reducer

const initialState: SecretStore = fromJS({} as SecretModel);

export const secretReducer: Reducer<SecretStore, SecretActions> = (state: SecretStore = initialState,
                                                                   action: SecretActions) => {
  if (action.type === SecretAT.Show) {
    return state
      .set('show', action.show);
  }
  return state;
};
