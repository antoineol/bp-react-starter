import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { useRealWebService } from '../common/app.config';
import { AppStore, StoreOf } from '../common/app.models';
import { apiGet } from '../common/app.utils';
import { handleError } from '../common/error.service';

// Model

export interface Counter {
  count: number;
}

export interface CounterModel {
  counter: Counter;
  loading?: boolean;
  error?: any | false;
}

export type CounterStore = StoreOf<CounterModel>;

export const COUNTER_REDUCER = 'counter';

// Actions

export enum CountActionTypes {
  Increment = 'Increment',
  IncrementSuccess = 'IncrementSuccess',
  IncrementError = 'IncrementError',
  UpdateCount = 'UpdateCount',
  DoubleCount = 'DoubleCount',
}

export interface IncrementAction {
  type: CountActionTypes.Increment;
}

export interface IncrementSuccessAction {
  type: CountActionTypes.IncrementSuccess;
  count: number;
}

export interface IncrementErrorAction {
  type: CountActionTypes.IncrementError;
  error: any;
}

export interface UpdateAction {
  type: CountActionTypes.UpdateCount;
  count: number;
}

export interface DoubleCountAction {
  type: CountActionTypes.DoubleCount;
}

export type CountActions =
  IncrementAction
  | UpdateAction
  | IncrementSuccessAction
  | IncrementErrorAction
  | DoubleCountAction;

// Action dispatcher bount to allowed action types for this service

export const dispatchCount = (action: CountActions) => action;

// Selectors

function getCountState(state: AppStore): CounterStore {
  return state.get(COUNTER_REDUCER);
}

export const selectCount = createSelector(
  getCountState,
  countState => countState.get('counter').get('count'),
);

// toJS

export const selectIncrementLoading = createSelector(
  getCountState,
  countState => countState.get('loading'),
);

// Saga

export interface TodoItem {
  id: number;
  title: string;
}

function* incrementSaga() {
  yield takeLatest(CountActionTypes.Increment, function* () {
    try {
      const oldCount: number = yield select(selectCount);

      let count: number;
      if (useRealWebService) {
        // Let's pretend we need to get an id from remote to compute the next count
        const [{ id, title }]: TodoItem[]
          = yield call(apiGet, `/todos`, { params: { id: oldCount } });
        console.log(`Title ${id}:`, title);
        count = id;
      } else {
        count = oldCount;
      }

      const successAction: IncrementSuccessAction = {
        count,
        type: CountActionTypes.IncrementSuccess,
      };
      yield put(successAction);
    } catch (err) {
      const errorAction: IncrementErrorAction = {
        type: CountActionTypes.IncrementError,
        error: err,
      };
      yield put(errorAction);
      handleError(err);
    }
  });
}

export const counterSagas = [
  incrementSaga,
];

// Reducer

const initialState: CounterStore = fromJS({ counter: { count: 1 } } as CounterModel);

export const counterReducer: Reducer<CounterStore, CountActions> = (state: CounterStore = initialState,
                                                                    action: CountActions) => {
  switch (action.type) {
    case CountActionTypes.Increment:
      return state
        .set('loading', true)
        .set('error', false);
    case CountActionTypes.IncrementSuccess:
      return state
        .set('loading', false)
        .set('counter', fromJS({ count: action.count + 1 } as Counter));
    case CountActionTypes.IncrementError:
      return state
        .set('loading', false)
        .set('error', action.error);
    case CountActionTypes.UpdateCount:
      return state
        .set('counter', fromJS({ count: action.count } as Counter));
    case CountActionTypes.DoubleCount:
      return state
        .set('counter', fromJS({ count: state.get('counter').get('count') * 2 } as Counter));
    default:
      return state;
  }
};
