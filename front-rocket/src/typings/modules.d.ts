declare namespace jest {
  interface Mock {
    calledWith: (...args: any[]) => this;
  }
}
declare module 'jest-when' {
  import Mock = jest.Mock;

  export function when(fn: Mock): Mock;
}
