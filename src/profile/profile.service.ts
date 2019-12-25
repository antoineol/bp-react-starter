import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { call, takeLatest } from 'redux-saga/effects';
import { StoreOf } from '../common/app.models';
import {
  apiGet,
  dispatchSaga,
  dispatchSagaErr,
  selectState,
  SimpleAction,
} from '../common/app.utils';

// Model

interface Profile {
  secured?: boolean;
  noRole?: boolean;
}

// To add to src/common/app.models.ts
export interface ProfileModel {
  loading?: boolean;
  error?: any;
  profile: Profile;
}

type ProfileStore = StoreOf<ProfileModel>;

export const PROFILE_REDUCER = 'profile';

// Actions

export enum ProfileAT {
  Load = 'ProfileAT_Load',
  LoadSuccess = 'ProfileAT_LoadSuccess',
  LoadError = 'ProfileAT_LoadError',
}

type ProfileAction = SimpleAction<ProfileAT>;

// Selectors

export const selectProfile = selectState(PROFILE_REDUCER, 'profile');
export const selectLoadingProfile = selectState(PROFILE_REDUCER, 'loading');

// Saga

function* loadProfileSaga() {
  yield takeLatest(ProfileAT.Load, function* () {
    try {
      const profile: Profile = yield call(apiGet, '/secured1');
      yield dispatchSaga(ProfileAT.LoadSuccess, profile);
    } catch (err) {
      yield dispatchSagaErr(ProfileAT.LoadError, err);
    }
  });
}

// To add to src/core/app.sagas.ts
export const profileSagas = [
  loadProfileSaga,
];

// Reducer

const initialState: ProfileStore = fromJS({} as ProfileModel);

// To add to src/core/app.reducers.ts
export const profileReducer: Reducer<ProfileStore, ProfileAction> = (state = initialState,
                                                                     action) => {
  switch (action.type) {
    case ProfileAT.Load:
      return state
        .set('loading', true)
        .remove('error');
    case ProfileAT.LoadSuccess:
      return state
        .set('loading', false)
        .set('profile', action.payload);
    case ProfileAT.LoadError:
      return state
        .set('loading', false)
        .set('error', action.payload);
    default:
      return state;
  }
};
