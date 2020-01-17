import gql from 'graphql-tag';
import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { takeLatest } from 'redux-saga/effects';
import { Author, Query_Root } from '../../hasura/gen/types';
import { StoreOf } from '../common/app.models';
import {
  apiQuery,
  dispatchSaga,
  dispatchSagaErr,
  selectState,
  SimpleAction,
} from '../common/app.utils';

// Model

// To add to src/common/app.models.ts
export interface AuthorModel {
  loading?: boolean;
  error?: any;
  authors: Author[];
}

type AuthorStore = StoreOf<AuthorModel>;

export const AUTHOR_REDUCER = 'author';

// Actions

export enum AuthorAT {
  Load = 'AuthorAT_Load',
  LoadSuccess = 'AuthorAT_LoadSuccess',
  LoadError = 'AuthorAT_LoadError',
}

type AuthorAction = SimpleAction<AuthorAT>;

// Selectors

export const selectAuthors = selectState(AUTHOR_REDUCER, 'authors');
export const selectLoadingAuthor = selectState(AUTHOR_REDUCER, 'loading');
export const selectAuthorError = selectState(AUTHOR_REDUCER, 'error');

// Saga

function* loadAuthorsSaga() {
  yield takeLatest(AuthorAT.Load, function* () {
    try {
      const resp: Query_Root = yield apiQuery(gql`query { author { id, name } }`);
      yield dispatchSaga(AuthorAT.LoadSuccess, resp.author);
    } catch (err) {
      yield dispatchSagaErr(AuthorAT.LoadError, err);
    }
  });
}

// To add to src/core/app.sagas.ts
export const authorSagas = [
  loadAuthorsSaga,
];

// Reducer

const initialState: AuthorStore = fromJS({} as AuthorModel);

// To add to src/core/app.reducers.ts
export const authorReducer: Reducer<AuthorStore, AuthorAction> = (state = initialState,
                                                                  action) => {
  switch (action.type) {
    case AuthorAT.Load:
      return state
        .set('loading', true)
        .remove('error');
    case AuthorAT.LoadSuccess:
      return state
        .set('loading', false)
        .set('authors', action.payload);
    case AuthorAT.LoadError:
      return state
        .set('loading', false)
        .set('error', action.payload);
    default:
      return state;
  }
};
