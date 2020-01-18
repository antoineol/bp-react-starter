import { featuresSaga } from '../common/services/features.service';
import { countSagas } from '../home/count.service';
import { authorSagas } from '../profile/author.service';
import { profileSagas } from '../profile/profile.service';

export const appSagas = [
  featuresSaga,
  ...countSagas,
  ...profileSagas,
  ...authorSagas,
];
