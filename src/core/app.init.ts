import { initAuth } from '../auth/auth.service';
import { initFeatures } from '../common/services/features.service';

export async function initAppServices() {
  // Synchronous initializations
  initAuth();
  initFeatures();
  const p: Promise<any>[] = [
    // Asynchronous, parallelized initializations to add here
  ];
  return Promise.all(p);
}
