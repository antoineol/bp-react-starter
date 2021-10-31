import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { env } from '../../environment/env';
import { hasuraReducer } from '../../features/hasura/redux-apollo-slice';
import { apiReducer } from '../../views/home/api.redux';
import { countReducer } from '../../views/home/count.service';
import { setStoreForDispatch } from './redux-dispatch-utils';

const reducer = {
  counter: countReducer,
  api: apiReducer,
  hasura: hasuraReducer,
};

export const store = configureStore({ reducer, devTools: env.isDev });

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// My additions to the template

setStoreForDispatch(store);
