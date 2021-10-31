import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiGet } from '../../common/utils/http.utils';
import { createAppSelector } from '../../core/redux/redux-selector-util';

interface IsAliveResponse {
  isAlive: boolean;
}

interface SecuredResponse {
  secured: boolean;
}

export const fetchIsAlive = createAsyncThunk(
  'api/',
  (): Promise<IsAliveResponse> => apiGet('/', { isPublic: true })
);

export const fetchSecured = createAsyncThunk(
  "api/secured",
  (): Promise<SecuredResponse> => apiGet("/secured")
);

interface ApiModel {
  isAlive?: boolean;
  isAliveLoading?: boolean;
  isAliveError?: any;
  secured?: boolean;
  securedLoading?: boolean;
  securedError?: any;
}

const apiSlice = createSlice({
  name: "api",
  initialState: {} as ApiModel,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIsAlive.pending, (state) => {
        state.isAliveLoading = true;
      })
      .addCase(fetchIsAlive.fulfilled, (state, action) => {
        state.isAlive = action.payload.isAlive;
        state.isAliveLoading = false;
        state.isAliveError = undefined;
      })
      .addCase(fetchIsAlive.rejected, (state, action) => {
        state.isAlive = undefined;
        state.isAliveLoading = false;
        state.isAliveError = action.error;
      })
      .addCase(fetchSecured.pending, (state) => {
        state.securedLoading = true;
      })
      .addCase(fetchSecured.fulfilled, (state, action) => {
        state.secured = action.payload.secured;
        state.securedLoading = false;
        state.securedError = undefined;
      })
      .addCase(fetchSecured.rejected, (state, action) => {
        state.secured = undefined;
        state.securedLoading = false;
        state.securedError = action.error;
      });
  }
});

export const apiReducer = apiSlice.reducer;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export function createApiSelector<Selected>(
  selector: (state: ApiModel) => Selected
) {
  return createAppSelector('api', selector);
}

export const selectIsAlive = createApiSelector((state) => state.isAlive);
export const selectIsAliveLoading = createApiSelector(
  (state) => state.isAliveLoading
);
export const selectIsAliveError = createApiSelector(
  (state) => state.isAliveError
);

export const selectSecured = createApiSelector((state) => state.secured);
export const selectSecuredLoading = createApiSelector(
  (state) => state.securedLoading
);
export const selectSecuredError = createApiSelector(
  (state) => state.securedError
);
