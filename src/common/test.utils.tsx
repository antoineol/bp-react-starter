import { createMount, createShallow } from '@material-ui/core/test-utils';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ReactWrapper, shallow } from 'enzyme';
import { createBrowserHistory, History } from 'history';
import React, { ComponentClass, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../_core/app.store';
import App from '../App';
import { AppStoreDirectModel } from './app.models';

export function shallowMui<T>(this: any, node: ReactElement<T>) {
  if (node && node.type) {
    const type = node.type as ComponentClass<T>;
    const hasMuiWithStylesWrapper = type.displayName && type.displayName.startsWith('WithStyles');
    if (hasMuiWithStylesWrapper) {
      return createShallow({ dive: true }).apply(this, arguments);
    }
  }
  return shallow.apply(this, arguments);
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

export function renderApp(initialStore: Partial<AppStoreDirectModel>,
                          initialLocalStorage?: LocalStorageModel) {
  mockLocalStorage(initialLocalStorage);
  const history: History = createBrowserHistory();
  const store = configureStore(initialStore, history);
  const mountMui = createMount();
  const wrapper = mountMui(
    <Provider store={store}>
      <App history={history} />
    </Provider>,
  );
  return { wrapper, history, store };
}

export function flushAllPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

export function mockHttpGet(url: string, status: number, response: any) {
  const mock = new MockAdapter(axios);
  mock.onGet(url).reply(status, response);
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
