import { initAuth } from '../auth/auth.service';
import { initFeatures } from '../common/services/features.service';

export async function initAppServices() {
  // Synchronous initializations
  initAuth();
  // Asynchronous, parallelized initializations
  const p = [
    initFeatures(),
  ];
  return Promise.all(p);
}
