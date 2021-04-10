import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createAppSelector } from '../../core/redux/redux-selector-util';
import { RejectedAction } from '../../core/redux/redux.models';

// export interface TodoItem {
//   id: number;
//   title: string;
// }
//
// export const selectCount = createCacheSelector(cache => cache.get('home').get('count'));
//
// export async function incrementCount(e: MouseEvent) {
//   e.preventDefault();
//   const count = readCacheCount();
//
//   let c: number;
//   if (appConfig.useRealWebService) {
//     // Let's pretend we need to get an id from remote to compute the next count
//     const [{ id }]: TodoItem[] = await httpGet(`https://jsonplaceholder.typicode.com/todos`,
//       { params: { id: count } });
//     c = id;
//   } else {
//     c = count;
//   }
//
//   writeCache({ home: { count: c + 1 } });
// }


export const incrementAsync = createAsyncThunk(
  'count/incrementAsync',
  async (arg, thunkAPI) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return 1;
  },
);


//   {
//   state: infer State;
// } ? State : unknown;

interface CountModel {
  value: number;
  loading?: boolean;
  error?: any;
}

const countSlice = createSlice({
  name: 'count',
  initialState: {
    value: 0,
  } as CountModel,
  reducers: {
    incrementCount: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    changeCount: (state, action) => {
      state.value = action.payload;
    },
    doubleCount: state => {
      state.value *= 2;
    },
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [incrementAsync.pending as unknown as string]: state => {
      state.loading = true;
    },
    [incrementAsync.fulfilled as unknown as string]: (state, action) => {
      state.value += action.payload;
      state.loading = false;
    },
    [incrementAsync.rejected as unknown as string]: (state, action: RejectedAction) => {
      state.error = action.error;
      state.loading = false;
    },
  },
});

// If you prefer a dynamic type based on initialState
// type CountModel = SliceToState<typeof countSlice>;

export const { incrementCount, changeCount, doubleCount } = countSlice.actions;

// // The function below is called a thunk and allows us to perform async logic. It
// // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// // will call the thunk with the `dispatch` function as the first argument. Async
// // code can then be executed and other actions can be dispatched
// export const incrementAsync = () => dispatch => {
//   setTimeout(() => {
//     dispatch(increment());
//   }, 1000);
// };

export const countReducer = countSlice.reducer;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export function createCountSelector<Selected>(selector: (state: CountModel) => Selected) {
  return createAppSelector('counter', selector);
}

export const selectCount = createCountSelector(state => state.value);
export const selectCountLoading = createCountSelector(state => state.loading);
export const selectCountError = createCountSelector(state => state.error);
// export const selectCount = (state: AppStateModel) => state.counter.value;
// export const selectCountLoading = (state: AppStateModel) => state.counter.loading;
// export const selectCountError = (state: AppStateModel) => state.counter.error;


// export function doubleCount(e: FormEvent) {
//   e.preventDefault();
//   const count = readCacheCount();
//   writeCache({ home: { count: count * 2 } });
// }
//
// export function changeCount(e: ChangeEvent<HTMLInputElement>, count: number) {
//   e.preventDefault();
//   writeCache({ home: { count } });
// }
//
// function readCacheCount() {
//   return readCache(cache => cache.get('home').get('count'));
// }
