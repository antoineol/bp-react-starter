import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { call, takeLatest } from 'redux-saga/effects';
import { appConfig } from '../common/app.config';
import { StoreOf } from '../common/app.models';
import {
  apiPost,
  dispatchSaga,
  dispatchSagaErr,
  getCookie,
  selectState,
  SimpleAction,
} from '../common/app.utils';
import { localSignOut, scheduleJwtRefresh, signInWithGoogle } from './googleSignIn.service';

// Model

// To add to src/common/app.models.ts
export interface AuthModel {
  loading?: boolean;
  error?: any;
  jwt?: string | boolean;
}

type AuthStore = StoreOf<AuthModel>;

export const AUTH_REDUCER = 'auth';

// Actions

export enum AuthAT {
  SignIn = 'AuthAT_SignIn',
  SignInSuccess = 'AuthAT_SignInSuccess',
  SignInError = 'AuthAT_SignInError',
  SignOut = 'AuthAT_SignOut',
  SignOutSuccess = 'AuthAT_SignOutSuccess',
  SignOutError = 'AuthAT_SignOutError',
}

type AuthAction = SimpleAction<AuthAT>;

// Selectors

// export const selectJwt = selectState(AUTH_REDUCER, 'jwt');
export const selectIsLoggedIn = selectState(AUTH_REDUCER, 'jwt', jwt => !!jwt);
export const selectAuthLoading = selectState(AUTH_REDUCER, 'loading');
export const selectAuthError = selectState(AUTH_REDUCER, 'error');

// Saga

function* signInSaga() {
  yield takeLatest(AuthAT.SignIn, function* () {
    try {
      const jwt = yield signInWithGoogle();
      yield dispatchSaga(AuthAT.SignInSuccess, jwt);
    } catch (err) {
      yield dispatchSagaErr(AuthAT.SignInError, err, err.message === 'CANCELED');
    }
  });
}

function* signOutSaga() {
  yield takeLatest(AuthAT.SignOut, function* () {
    try {
      yield call(signOut);
      yield dispatchSaga(AuthAT.SignOutSuccess);
    } catch (err) {
      yield dispatchSagaErr(AuthAT.SignOutError, err);
    }
    localSignOut();
  });
}

// To add to src/core/app.sagas.ts
export const authSagas = [
  signInSaga,
  signOutSaga,
];

// Reducer
const jwt = getCookie(appConfig.jwtCookieName);
scheduleJwtRefresh(jwt);
const initialState: AuthStore = fromJS({ jwt: jwt || false } as AuthModel);

// To add to src/core/app.reducers.ts
export const authReducer: Reducer<AuthStore, AuthAction> = (state = initialState,
                                                            action) => {
  switch (action.type) {
    case AuthAT.SignIn:
    case AuthAT.SignOut:
      return state
        .set('loading', true)
        .remove('error');
    case AuthAT.SignInSuccess:
      return state
        .set('loading', false)
        .set('jwt', fromJS(action.payload));
    case AuthAT.SignOutSuccess:
      return state
        .set('loading', false)
        .remove('jwt');
    case AuthAT.SignInError:
    case AuthAT.SignOutError:
      return state
        .set('loading', false)
        .set('error', fromJS(action.payload));
    default:
      return state;
  }
};

export function signOut(): Promise<void> {
  return apiPost('/auth/signout');
}
