import { fireEvent, render } from '@testing-library/react';
import axios, { AxiosResponse } from 'axios';
import { createBrowserHistory } from 'history';
import React from 'react';
import App from '../../App';
import { AppCache, defaultStore } from '../models/defaultStore';
import { Features } from '../services/features.service';
import { writeCache } from '../utils/app.utils';

// Default HTTP mocks. Can be overridden in each test.
mockApiGet(() => ({}));
mockApiPost(() => ({ success: true }));

export async function renderTestAppSignedIn(initialCache: Partial<AppCache> = {},
                                            initialLocalStorage: LocalStorageModel = {},
                                            jwt = 'fake jwt') {
  return renderTestApp({ ...initialCache, ...{ jwt } }, initialLocalStorage);
}

export async function renderTestApp(initialCache: Partial<AppCache> = {},
                                    initialLocalStorage: LocalStorageModel = {}) {
  writeCache({ ...initialCache, ...{ features: allFeaturesEnabled() } });
  mockLocalStorage(initialLocalStorage);
  const wrapper = render(<App history={createBrowserHistory()} />);
  return { ...wrapper };
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

function allFeaturesEnabled(): Features {
  const feats = defaultStore.features as unknown as Features;
  for (const featName of Object.keys(feats)) {
    if (!feats[featName]) {
      feats[featName] = true;
    }
  }
  return feats;
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
