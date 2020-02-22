import { initFeatures } from '../common/services/features.service';
import { initAuth } from '../views/auth/auth.service';

export async function initAppServices() {
  // Synchronous initializations
  initAuth();
  initFeatures();
  const p: Promise<any>[] = [
    // Asynchronous, parallelized initializations to add here
  ];
  return Promise.all(p);
}
