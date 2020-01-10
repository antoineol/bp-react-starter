import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { StoreOf } from '../../common/app.models';
import { selectState, SimpleAction } from '../../common/app.utils';

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

type SecretAction = SimpleAction<SecretAT>;

// Selectors

export const selectShowSecret = selectState(SECRET_REDUCER, 'show');

// Reducer

const initialState: SecretStore = fromJS({} as SecretModel);

export const secretReducer: Reducer<SecretStore, SecretAction> = (state: SecretStore = initialState,
                                                                  action: SecretAction) => {
  if (action.type === SecretAT.Show) {
    return state.set('show', action.payload);
  }
  return state;
};
