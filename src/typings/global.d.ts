import { LocalStorageMock } from '../test/test.utils';

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
