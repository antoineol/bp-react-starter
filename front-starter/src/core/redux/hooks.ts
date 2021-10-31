import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from './redux.store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// Something is wrong with the above typing... async thunks are rejected.
export const useAppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
