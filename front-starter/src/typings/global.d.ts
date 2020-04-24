import { LocalStorageMock } from '../test/test.utils';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__<R>(...args: any): (...args: any[]) => R;
  }

  interface Window {
    localStorage: LocalStorageMock;
  }

  namespace NodeJS {
    interface Global {
      localStorage: LocalStorageMock;
    }
  }
}
