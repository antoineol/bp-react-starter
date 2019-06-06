import { Checkbox } from '@material-ui/core';
import axios, { AxiosResponse } from 'axios';
import { mount, ReactWrapper } from 'enzyme';
import { ComponentType } from 'react';
import App from '../App';
import { makeApp } from '../core/_bootstrap/core.utils';
import { AppStoreDirectModel } from './app.models';

// Default HTTP mocks. Can be overridden in each test.
mockApiGet(() => ({}));
mockApiPost(() => ({ success: true }));

export async function renderTestApp(initialStore: Partial<AppStoreDirectModel> = {},
                                    initialLocalStorage: LocalStorageModel = {}) {
  mockLocalStorage(initialLocalStorage);
  const { app, history, store } = makeApp(App, initialStore);
  const wrapper = mount(app);
  return { history, store, app: wrapper };
}

export function updateInput(wrapper: ReactWrapper<any, any>, nameProp: string, value: string) {
  return updateField(wrapper, nameProp, value, `input[name="${nameProp}"]`);
}

export function updateRadio(wrapper: ReactWrapper<any, any>, nameProp: string, value: string) {
  return updateField(wrapper, nameProp, value, `input[name="${nameProp}"][value="${value}"]`);
}

export function updateSlider(wrapper: ReactWrapper<any, any>, nameProp: string, value: number) {
  return updateField(wrapper, nameProp, value, `Slider[name="${nameProp}"]`);
}

export function getCompByName(wrapper: ReactWrapper<any, any>, comp: ComponentType<any> | string,
                              nameProp: string) {
  return wrapper.findWhere(n => isTargetComp(n, comp, nameProp));
}

export function compValue(wrapper: ReactWrapper<any, any>, comp: ComponentType<any> | string,
                          nameProp: string) {
  const valueProp = comp === Checkbox ? 'checked' : 'value';
  const compWrapper = isTargetComp(wrapper, comp, nameProp) ? wrapper :
    getCompByName(wrapper, comp, nameProp);
  return compWrapper.prop(valueProp);
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

/**
 * Dirty utility in case we want to wait for a predicate to be true (e.g. that a component
 * appears in the view). It runs the `predicate` function initially and after `timeout` ms.
 * If still not true after that, it fails.
 * @param wrapper - a parent component on which the predicate will be evaluated.
 * @param predicate - function to know if what we are waiting for is here.
 * @param timeout - runs the `predicate` after `timeout` ms and fail after this timeout if the
 * predicate still fails.
 */
//
export function wait(wrapper: ReactWrapper, predicate: (wrapper: ReactWrapper) => boolean,
                     timeout: number = 10) {
  return new Promise((resolve, reject) => {
    if (predicate(wrapper)) {
      return resolve(true);
    }
    setTimeout(() => {
      wrapper.update();
      return predicate(wrapper) ? resolve(true) : reject(new Error('Timeout expired'));
    }, timeout);
  });
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

function updateField(wrapper: ReactWrapper<any, any>, nameProp: string, value: any,
                     selector: string) {
  return wrapper
    .find(selector)
    .simulate('change', {
      target: {
        value,
        name: nameProp,
        focus: () => {
        },
      },
    });
}

function isTargetComp(comp: ReactWrapper<any, any>, targetComp: ComponentType<any> | string,
                      nameProp: string): boolean {
  const compName = comp.name();
  const targetName = typeof targetComp === 'string' ? targetComp :
    targetComp.displayName || targetComp.name;
  return (compName === targetName || compName === `ForwardRef(${targetName})`) &&
    comp.prop('name') === nameProp;
}

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
