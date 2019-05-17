import { Checkbox } from '@material-ui/core';
import { createMount, createShallow } from '@material-ui/core/test-utils';
import { ReactWrapper, shallow } from 'enzyme';
import React, { ComponentClass, ComponentType, ReactElement } from 'react';
import App from '../App';
import { makeApp } from '../core/_bootstrap/core.utils';
import { AppStoreDirectModel } from './app.models';

export function renderTestApp(initialStore: Partial<AppStoreDirectModel> = {},
                              initialLocalStorage: LocalStorageModel = {}) {
  mockLocalStorage(initialLocalStorage);
  const mountMui = createMount();
  const { app, history, store } = makeApp(App, initialStore);
  const wrapper = mountMui(app);
  return { history, store, app: wrapper };
}

export function shallowMui<T>(this: any, node: ReactElement<T>) {
  if (node && node.type) {
    const type = node.type as ComponentClass<T>;
    const hasMuiWithStylesWrapper = type.displayName && type.displayName.startsWith('WithStyles');
    if (hasMuiWithStylesWrapper) {
      return createShallow({ dive: true }).apply(this, arguments as any);
    }
  }
  return shallow.apply(this, arguments as any);
}

/**
 * Dirty utility in case we want to wait for a predicate to be true (e.g. that a component
 * appears in the view). In other words, it runs the `predicate` function every `timeout` ms
 * until it returns `true`
 * @param wrapper - a parent component on which the predicate will be evaluated.
 * @param predicate - function to know if the should keep watching or not
 * @param timeout - runs the `predicate` every `timeout` ms until it returns `true`
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

export function mockLocalStorage(initialLocalStorage?: LocalStorageModel): void {
  delete global.localStorage;
  global.localStorage = new LocalStorageMock();
  if (initialLocalStorage) {
    for (const k of Object.keys(initialLocalStorage) as (keyof LocalStorageModel)[]) {
      global.localStorage[k] = initialLocalStorage[k];
    }
  }
}

export function flushAllPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

// For debug purpose only. Don't use for real test / code!
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function updateRadio(wrapper: ReactWrapper<any, any>, nameProp: string, value: string) {
  wrapper
  // For a text input, remove the `[value="${value}"]` part from the CSS selector.
    .find(`input[name="${nameProp}"][value="${value}"]`)
    .simulate('change', { target: { value, name: nameProp } });
}

export function compByName(wrapper: ReactWrapper<any, any>, comp: ComponentType<any>,
                           nameProp: string) {
  return wrapper.findWhere(n => isTargetComp(n, comp, nameProp));
}

export function compValue(wrapper: ReactWrapper<any, any>, comp: ComponentType<any>,
                          nameProp: string) {
  const valueProp = comp === Checkbox ? 'checked' : 'value';
  const compWrapper = isTargetComp(wrapper, comp, nameProp) ? wrapper :
    compByName(wrapper, comp, nameProp);
  return compWrapper.prop(valueProp);
}

function isTargetComp(wrapper: ReactWrapper<any, any>, comp: ComponentType<any>,
                      nameProp: string): boolean {
  return wrapper.name() === (comp.displayName || comp.name) && wrapper.prop('name') === nameProp;
}

/**
 * Type utility only. It does nothing at runtime, just cast to the right mocked type.
 * `const axiosMocked = mocked(axios);`
 * is equivalent to
 * `const axiosMocked = axios as jest.Mock<typeof axios>;`
 * @param module
 */
export function mocked<T>(module: T): jest.Mocked<T> {
  return module as jest.Mocked<T>;
}

// In case we need to debug something
// function timeout(duration: number): Promise<void> {
//   return new Promise(resolve => setTimeout(resolve, duration));
// }

class LocalStorageModel {
  jwt?: string;
}

export class LocalStorageMock {
  constructor(private jwt?: string) {
  }

  clear() {
    this.jwt = undefined;
  }

  getItem(key: 'jwt') {
    return this.jwt != null ? this.jwt : null;
  }

  setItem(key: 'jwt', value: string) {
    this.jwt = value;
  }

  removeItem(key: 'jwt') {
    delete this.jwt;
  }
}

declare global {
  interface Window {
    localStorage: LocalStorageMock;
  }

  namespace NodeJS {
    interface Global {
      localStorage: LocalStorageMock;
    }
  }
}
