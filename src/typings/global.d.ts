import { LocalStorageMock } from '../common/test/test.utils';

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
