import { initFeatures } from '../common/services/features.service';
import { addJwtToCacheAndScheduleRefresh } from '../features/auth/auth.service';
import { initServiceWorker } from '../features/pwa/sw.service';

export async function initAppServices() {
  // Synchronous initializations
  initServiceWorker();
  addJwtToCacheAndScheduleRefresh();
  initFeatures();
  const p: Promise<any>[] = [
    // Asynchronous, parallelized initializations to add here
  ];
  return Promise.all(p);
}
