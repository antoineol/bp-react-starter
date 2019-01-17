// Model

import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import { AppStore, StoreOf } from '../common/app.models';
import { toJS } from '../common/app.utils';
import { handleError } from '../common/error.service';

export interface Counter {
  count: number;
}

export interface CounterModel {
  count?: Counter;
  loading?: boolean;
  error?: any | false;
}

export type CounterStore = StoreOf<CounterModel>;

export const COUNTER_REDUCER = 'counter';

// Action

const INCREMENT = 'INCREMENT';
const INCREMENT_SUCCESS = 'INCREMENT_SUCCESS';
const INCREMENT_ERROR = 'INCREMENT_ERROR';

interface IncrementAction {
  type: typeof INCREMENT;
}

interface IncrementSuccessAction {
  type: typeof INCREMENT_SUCCESS;
  data: Counter;
}

interface IncrementErrorAction {
  type: typeof INCREMENT_ERROR;
  error: any;
}

export function increment(): IncrementAction {
  return {
    type: INCREMENT,
  };
}

// Selector

function selectCounter(state: AppStore): CounterStore {
  return state.get(COUNTER_REDUCER);
}

export function selectCount() {
  return createSelector(
    selectCounter,
    secured => toJS(secured.get('count')),
  );
}

export function selectIncrementLoading() {
  return createSelector(
    selectCounter,
    secured => toJS(secured.get('loading')),
  );
}

// Saga

async function fakeFetchCount(oldCount: number): Promise<Counter> {
  return new Promise(resolve => setTimeout(() => resolve({ count: oldCount + 1 }), 500));
}

function* incrementCount(): Generator {
  try {
    const oldCount = yield select(selectCount);
    const countResp: Counter = yield call(fakeFetchCount, oldCount);
    const successAction: IncrementSuccessAction = {
      type: INCREMENT_SUCCESS,
      data: countResp,
    };
    yield put(successAction);
  } catch (err) {
    const errorAction: IncrementErrorAction = { type: INCREMENT_ERROR, error: err };
    yield put(errorAction);
    handleError(err);
  }
}

function* incrementSaga() {
  yield takeLatest(INCREMENT, incrementCount);
}

export const counterSagas = [
  incrementSaga,
];

// Reducer

const initialState: CounterStore = fromJS({} as CounterModel);

export const counterReducer: Reducer<CounterStore> = (state: CounterStore = initialState,
                                                      action: IncrementAction | IncrementSuccessAction | IncrementErrorAction) => {
  switch (action.type) {
    case INCREMENT:
      return state
        .set('loading', true)
        .set('error', false);
    case INCREMENT_SUCCESS:
      return state
        .set('loading', false)
        .set('count', fromJS({ count: action.data.count + 1 } as Counter));
    case INCREMENT_ERROR:
      return state
        .set('loading', false)
        .set('error', action.error);
    default:
      return state;
  }
};
