import { selectState } from '../app.utils';

// Don't change the value, it's used by connected-react-router (RouterRootState)
export const ROUTER_REDUCER = 'router';

export const selectLocation = selectState(ROUTER_REDUCER, 'location');
