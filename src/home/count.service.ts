import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import { call, select, takeLatest } from 'redux-saga/effects';
import { appConfig } from '../common/app.config';
import { StoreOf } from '../common/app.models';
import {
  dispatchSaga,
  dispatchSagaErr,
  httpGet,
  selectState,
  SimpleAction,
} from '../common/app.utils';

// Model

// To add to src/common/app.models.ts
export interface CountModel {
  loading?: boolean;
  error?: any;
  count: number;
}

type CountStore = StoreOf<CountModel>;

export const COUNT_REDUCER = 'count';

// Actions

export enum CountAT {
  Increment = 'Increment',
  IncrementSuccess = 'IncrementSuccess',
  IncrementError = 'IncrementError',
  UpdateCount = 'UpdateCount',
  DoubleCount = 'DoubleCount',
}

type CountAction = SimpleAction<CountAT>;

// Selectors

export const selectCount = selectState(COUNT_REDUCER, 'count');
export const selectIncrementLoading = selectState(COUNT_REDUCER, 'loading');

// Saga

export interface TodoItem {
  id: number;
  title: string;
}

function* incrementSaga() {
  yield takeLatest(CountAT.Increment, function* () {
    try {
      const oldCount: number = yield select(selectCount);

      let count: number;
      if (appConfig.useRealWebService) {
        // Let's pretend we need to get an id from remote to compute the next count
        const [{ id }]: TodoItem[]
          = yield call(httpGet, `https://jsonplaceholder.typicode.com/todos`,
          { params: { id: oldCount } });
        count = id;
      } else {
        count = oldCount;
      }

      yield dispatchSaga(CountAT.IncrementSuccess, count);
    } catch (err) {
      yield dispatchSagaErr(CountAT.IncrementError, err);
    }
  });
}

// To add to src/core/app.sagas.ts
export const countSagas = [
  incrementSaga,
];

// Reducer

const initialState: CountStore = fromJS({ count: 1 } as CountModel);

// To add to src/core/app.reducers.ts
export const countReducer: Reducer<CountStore, CountAction> = (state = initialState,
                                                               action) => {
  switch (action.type) {
    case CountAT.Increment:
      return state
        .set('loading', true)
        .remove('error');
    case CountAT.IncrementSuccess:
      return state
        .set('loading', false)
        .set('count', action.payload + 1);
    case CountAT.IncrementError:
      return state
        .set('loading', false)
        .set('error', action.payload);
    case CountAT.UpdateCount:
      return state.set('count', action.payload);
    case CountAT.DoubleCount:
      return state.set('count', state.get('count') * 2);
    default:
      return state;
  }
};
