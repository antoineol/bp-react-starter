import { appConfig } from '../../common/app.config';
import { handleError } from '../../common/services/error.service';
import { env } from '../../environment/env';
import { register, unregister } from './serviceWorker';

// This file is separated from serviceWorker.ts so that the latter remain as close as possible
// to the default CRA version (it was slightly modified to handle more events).

interface Resolver<T> {
  (value: T | PromiseLike<T>): void;
}

let resolveUpdateAvailable: Resolver<ServiceWorkerRegistration>;
export const updateAvailablePromise = new Promise<ServiceWorkerRegistration>(
  resolve => resolveUpdateAvailable = resolve);

let resolveSwReady: Resolver<ServiceWorkerRegistration>;
export const swReadyPromise = new Promise<ServiceWorkerRegistration>(
  resolve => resolveSwReady = resolve);

let resolveInstallUpdate: Resolver<ServiceWorkerRegistration>;
export const installUpdatePromise = new Promise<ServiceWorkerRegistration>(
  resolve => resolveInstallUpdate = resolve);

let initialized = false;

/**
 * Edit this function to enable or disable offline mode with service workers.
 */
export function initServiceWorker() {
  if (initialized || env.isJest) {
    return;
  }
  initialized = true;
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  if (env.useServiceWorker) {
    register({
      // onSuccess: resolveOfflineReady,
      onUpdate: resolveUpdateAvailable,
      onReady: resolveSwReady,
      onInstallUpdate: resolveInstallUpdate,
    });
  } else {
    unregister();
  }

  // If a user clicks the "Install" button, all tabs refresh with below event listener. It reloads
  // the current page when a new active service worker is detected. From Approach #3:
  // https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange',
    () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    },
  );
}

let id: NodeJS.Timeout;

/**
 * Regularly checks if a service worker update is available. If an update becomes available, it
 * will trigger the related event, caught by ConnectionStatus, and an update button will be
 * displayed.
 * @param registration
 */
export function checkUpdates(registration: ServiceWorkerRegistration) {
  if (!id && registration) {
    id = setInterval(() => {
      registration.update().catch(handleError);
    }, appConfig.updateCheckInterval * 1000);
  }
}
