import gql from 'graphql-tag';
import { Features } from '../../../hasura/gen/types';
import { appConfig } from '../app.config';
import { writeCache } from '../utils/app.utils';

// Service for feature toggling: enabled features are managed in the API.

export const featuresMock: Features = {
  queryJsonPlaceholder: true,
  __typename: 'Features',
};

export const GET_JSON_PL_REMOTE = gql`{ features { queryJsonPlaceholder } }`;

export function initFeatures() {
  if (!appConfig.useServerFeatures) {
    writeCache({ features: featuresMock });
  }
}
