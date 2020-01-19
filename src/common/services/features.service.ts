import gql from 'graphql-tag';
import { appConfig } from '../app.config';
import { writeCache } from '../utils/app.utils';
import { apiGet } from '../utils/http.utils';

// Service for feature toggling: enabled features are managed in the API.

export interface Features {
  [featureName: string]: boolean;
}

export const GET_JSON_PL = gql`{ features @client { queryJsonPlaceholder } }`;

export async function initFeatures() {
  if (appConfig.useServerFeatures) {
    const features: Features = await apiGet('/features');
    writeCache({ features });
  }
}
