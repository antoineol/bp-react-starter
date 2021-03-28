import React from 'react';
import { initServiceWorker } from '../features/pwa/sw.service';

export async function initAppServices() {
  // Synchronous initializations
  initServiceWorker();
  // addJwtToCacheAndScheduleRefresh();
  const p: Promise<any>[] = [
    // Asynchronous, parallelized initializations to add here
  ];
  return Promise.all(p);
}
