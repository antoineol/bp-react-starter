// import './common/test/global-mocks'; // global mocks should be first import

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import * as gqlClientModule from './common/graphql.client';

(gqlClientModule as any).getGqlClient = errMock('getGqlClient');
(gqlClientModule as any).resetWsConnection = errMock('resetWsConnection');

function errMock(fnName: string) {
  return () => {
    throw new Error(`${fnName}() was called before it has been mocked. Ensure you don't call it at the' +
    ' root of your files but rather in functions you call when you need them.`);
  };
}
