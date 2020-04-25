import { appConfig } from '../app.config';
import { Features } from '../cache/cache.model';
import { writeCache } from '../cache/cache.utils';

// Service for feature toggling: enabled features are managed in the API.

export const featuresMock: Partial<Features> = {
  queryJsonPlaceholder: true,
};

export function initFeatures() {
  if (!appConfig.useServerFeatures) {
    writeCache({ features: featuresMock });
  }
}
