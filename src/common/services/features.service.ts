import { call } from '@redux-saga/core/effects';
import { fromJS } from 'immutable';
import { useSelector } from 'react-redux';
import { Reducer } from 'redux';
import { StoreOf } from '../app.models';
import { apiGet, dispatchSaga, dispatchSagaErr, selectState, SimpleAction } from '../app.utils';

// Service for feature toggling: enabled features are managed in the API.

export interface Features {
  [featureName: string]: boolean;
}

// Model

// To add to src/common/app.models.ts
export interface FeaturesModel {
  error?: any;
  features: Features;
}

type FeaturesStore = StoreOf<FeaturesModel>;

export const FEATURES_REDUCER = 'features';

// Actions

export enum FeatAT {
  FeaturesLoaded = 'FeatAT_FeaturesLoaded',
  FeaturesError = 'FeatAT_FeaturesError',
}

type FeaturesAction = SimpleAction<FeatAT>;

// Selectors

export const selectFeatures = selectState(FEATURES_REDUCER, 'features');

export function useFeatures() { // utility that can be easily mocked for tests
  return useSelector(selectFeatures);
}

// Saga

export function* featuresSaga() {
  try {
    const features: Features = yield call(apiGet, '/features');
    yield dispatchSaga(FeatAT.FeaturesLoaded, features);
  } catch (err) {
    yield dispatchSagaErr(FeatAT.FeaturesError, err);
  }
}

// Reducer
const initialState: FeaturesStore = fromJS({ features: {} } as FeaturesModel);

// To add to src/core/app.reducers.ts
export const featuresReducer: Reducer<FeaturesStore, FeaturesAction> = (state = initialState,
                                                                        action) => {
  switch (action.type) {
    case FeatAT.FeaturesLoaded:
      return state
        .set('features', fromJS(action.payload));
    case FeatAT.FeaturesError:
      return state
        .set('error', fromJS(action.payload));
    default:
      return state;
  }
};
