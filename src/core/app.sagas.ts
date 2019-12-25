import { authSagas } from '../auth/auth.service';
import { featuresSaga } from '../common/services/features.service';
import { countSagas } from '../home/count.service';
import { profileSagas } from '../profile/profile.service';

export const appSagas = [
  featuresSaga,
  ...countSagas,
  ...authSagas,
  ...profileSagas,
];
