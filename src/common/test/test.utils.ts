import { fireEvent, render } from '@testing-library/react';
import axios, { AxiosResponse } from 'axios';
import App from '../../App';
import { AUTH_REDUCER } from '../../auth/auth.service';
import { makeApp } from '../../core/_bootstrap/core.utils';
import { AppStoreDirectModel } from '../app.models';
import * as featuresService from '../services/features.service';
import * as initialStoreModule from '../../core/_bootstrap/initialStore';

// Default HTTP mocks. Can be overridden in each test.
mockApiGet(() => ({}));
mockApiPost(() => ({ success: true }));

// All features are enabled in test environment
(featuresService as any).useFeatures = () => ({ get: () => true });
// featuresSaga early mock is located in src/setupTests.ts

export async function renderTestAppSignedIn(initialStore: Partial<AppStoreDirectModel> = {},
                                            initialLocalStorage: LocalStorageModel = {},
                                            jwt = 'fake jwt') {
  const signedInStore: Partial<AppStoreDirectModel> = { [AUTH_REDUCER]: { jwt } };
  return renderTestApp({ ...initialStore, ...signedInStore }, initialLocalStorage);
}

export async function renderTestApp(initialStore: Partial<AppStoreDirectModel> = {},
                                    initialLocalStorage: LocalStorageModel = {}) {
  // Mock initial store
  (initialStoreModule as any).initialStore = initialStore;
  mockLocalStorage(initialLocalStorage);
  const { app, history, store } = makeApp(App);
  const wrapper = render(app);
  return { history, store, ...wrapper };
}

/**
 * Simulates a click on an element
 * @param element element to click
 */
export function clickElt(element: Document | Element | Window) {
  const leftClick = { button: 0 };
  fireEvent.click(element, leftClick);
}

/**
 * Simulates a value change in an input
 * @param element input element
 * @param value new value emitted
 */
export function changeInput(element: Document | Element | Window, value: any) {
  fireEvent.change(element, { target: { value } });
}

/**
 * Submit the form which the given element belongs to
 * @param element
 */
export function submitInput(element: Document | Element | Window) {
  fireEvent.submit(element);
}

/**
 * Mock axios get method for tests that involve HTTP requests.
 * @param mockImplementation a method that returns the response body or a promise resolved with
 * the response body.
 * @return jest mock object that can be used for assertions, e.g. axios.get was called n times,
 * with the right parameters...
 * @example
 * ```typescript
 * const mockApi = mockApiGet(() => {some: 'responseBodyData'});
 * // Code that runs an HTTP request
 * expect(mockApi).toHaveBeenCalledTimes(1);
 * expect(mockApi).toHaveBeenCalledWith(simulateUrl, expectedRequestParams);
 * ```
 */
export function mockApiGet<T>(mockImplementation: (url?: string) => T) {
  return mockApi('get')(mockImplementation);
}

export function mockApiGetReject<T>(mockImplementation: (...args: any) => T) {
  return mockApiGet((...args) => Promise.reject(mockImplementation(...args)));
}

export function mockApiPost<T>(mockImplementation: (...args: any) => T) {
  return mockApi('post')(mockImplementation);
}

export function mockApiPostReject<T>(mockImplementation: (...args: any) => T) {
  return mockApiPost((...args) => Promise.reject(mockImplementation(...args)));
}

export function flushAllPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

// For debug purpose only. Don't use for real test / code!
// function timeout(duration: number): Promise<void> {
//   return new Promise(resolve => setTimeout(resolve, duration));
// }

export function mockLocalStorage(initialLocalStorage?: LocalStorageModel): void {
  delete global.localStorage;
  global.localStorage = new LocalStorageMock();
  Object.assign(global.localStorage, initialLocalStorage);
}

export class LocalStorageModel {
  // Declare local storage fields here. Use string as type.
  foo?: string;
}

// Implementation details

function mockApi<T>(method: 'get' | 'post') {
  return (mockImplementation: (...args: any) => T | Promise<T>) => {
    return jest.spyOn(axios, method).mockImplementation(async (...args) => {
      try {
        const res = await mockImplementation(...args);
        return {
          status: 200,
          statusText: 'OK',
          data: res,
          headers: {},
          config: {},
        } as AxiosResponse<T>;
      } catch (e) {
        throw Object.assign(new Error('Fake Axios Error'), {
          response: {
            status: e.status || 400,
            statusText: 'Bad Request',
            data: e,
            headers: {},
            config: {},
          },
        });
      }
    });
  };
}

class LocalStorageMock extends LocalStorageModel {
  clear() {
    for (const k of Object.keys(this) as (keyof LocalStorageModel)[]) {
      delete this[k];
    }
  }

  getItem(key: keyof LocalStorageModel) {
    const elt = this[key];
    return elt != null ? elt : null;
  }

  setItem(key: keyof LocalStorageModel, value: string) {
    this[key] = value;
  }

  removeItem(key: keyof LocalStorageModel) {
    delete this[key];
  }
}
