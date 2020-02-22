import { useApolloClient } from '@apollo/react-hooks';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import axios, { AxiosResponse } from 'axios';
import { when } from 'jest-when';
import React, { FC, ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router';
import { Features } from '../../generated/schema';
import App from '../App';
import * as gqlClientModule from '../common/graphql.client';
import { AppCache, defaultStore } from '../common/localStore';
import { featuresMock } from '../common/services/features.service';
import { writeCache } from '../common/utils/app.utils';
import { initAppServices } from '../core/app.init';
import { defaultStoreAdditionsForTests, mockGqlQueries } from './test.mocks';

type HttpMethod = 'get' | 'post';

// Default HTTP mocks. Can be overridden in each test.
for (const method of ['get'] as HttpMethod[]) initialAxiosMock(method);

export async function renderTestAppSignedIn(url = '/',
                                            initialCache: Partial<AppCache> = {},
                                            initialLocalStorage: LocalStorageModel = {},
                                            jwt = 'fake jwt') {
  return renderTestApp(url, { ...initialCache, ...{ jwt } }, initialLocalStorage);
}

export async function renderTestApp(url = '/',
                                    initialCache: Partial<AppCache> = {},
                                    initialLocalStorage: LocalStorageModel = {}) {
  let rendered: RenderResult | null = null;
  await act(async () => {
    const mergedCache: Partial<AppCache> = {
      ...defaultStore,
      ...defaultStoreAdditionsForTests,
      ...initialCache,
      ...{ features: allFeaturesEnabled() },
    };
    mockLocalStorage(initialLocalStorage);
    rendered = render(
      <MockedProvider mocks={mockGqlQueries} addTypename={false} resolvers={{}}>
        <MemoryRouter initialEntries={[url]}>
          <MockGqlClient cache={mergedCache}>
            <App />
          </MockGqlClient>
        </MemoryRouter>
      </MockedProvider>);
    // If tests fail because the component didn't finish to render, we may need to replace this
    // quick wait with a wait for a UI element to render (react test util has a wait function for
    // that). Source: Apollo doc:
    // https://www.apollographql.com/docs/react/development-testing/testing/#testing-final-state
    await flushAllPromises();
  });
  return rendered as unknown as RenderResult;
}

const MockGqlClient: FC<{ cache: Partial<AppCache> }> = ({ children, cache }) => {
  const client = useApolloClient();
  // Mock gqlClient methods exposed for services
  (gqlClientModule as any).getGqlClient = () => client;
  (gqlClientModule as any).resetWsConnection = () => {
  };
  initAppServices().catch(err => console.error(err));
  writeCache(cache);
  return children as ReactElement;
};

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

// export function mockApiGet<T>(mockImplementation: (url?: string) => T) {
//   return mockApi('get')(mockImplementation);
// }

/**
 * Mock axios get method for tests that involve HTTP requests.
 * the response body.
 * @param url URL to mock with this returned value
 * @param returnValue Response body or a promise resolved with response body
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
export function mockApiGet<T>(url: string, returnValue: T) {
  return mockApi('get', url, returnValue);
}

export function mockApiGetReject<T>(url: string, returnValue: T) {
  return mockApiGet(url, Promise.reject(returnValue));
}

export function mockApiPost<T>(url: string, returnValue: T) {
  return mockApi('post', url, returnValue);
}

export function mockApiPostReject<T>(url: string, returnValue: T) {
  return mockApiPost(url, Promise.reject(returnValue));
}

export function flushAllPromises() {
  return new Promise<void>(resolve => setImmediate(resolve));
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

function mockApi<T>(method: HttpMethod, url: string, returnValue: T) {
  initialAxiosMock(method);
  const fn = axios[method] as any;
  when(fn).calledWith(url).mockImplementation(async () => {
    try {
      const res = await returnValue;
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
  return fn;
}

function initialAxiosMock(method: HttpMethod) {
  if (!(axios[method] as any).mock) {
    axios[method] = jest.fn();
  }
}

function allFeaturesEnabled(): Features {
  const feats = { ...featuresMock }; // Shallow copy
  for (const featName of Object.keys(feats) as (keyof typeof feats)[]) {
    if (feats[featName] === false) {
      // Type patch required, probably because of the __typename which is not a boolean.
      (feats[featName] as boolean) = true;
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
