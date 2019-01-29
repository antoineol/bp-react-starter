import { createMount, createShallow } from '@material-ui/core/test-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ReactWrapper, shallow } from 'enzyme';
import React, { ComponentClass, ReactElement } from 'react';
import App, { makeApp } from '../App';
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

export interface MockHttpOptions {
  status?: number;
}

const defaultMockHttpOptions = { status: 200 };

export function mockHttpGet(url: string, response: any, mockHttpOptions?: MockHttpOptions) {
  const opt = { ...defaultMockHttpOptions, ...mockHttpOptions };
  const mock = new MockAdapter(axios);
  mock.onGet(url).reply(opt.status, response);
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
