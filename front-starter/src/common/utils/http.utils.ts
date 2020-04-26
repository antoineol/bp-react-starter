import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { env } from '../../environment/env';
import { fetchNewJwt } from '../../features/auth/auth.service';
import { appConfig } from '../app.config';
import { wait } from './app.utils';

export function useApiGet<T>(url: string,
                             config?: AxiosRequestConfig) {
  const [{ loading, data, error }, setState] = useState<{
    loading: boolean;
    data?: T;
    error?: any;
  }>(
    { loading: true, data: undefined, error: undefined });
  useEffect(() => {
    apiGet<T>(url, config)
      .then(data => setState({ loading: false, data, error: undefined }))
      .catch(error => setState({ loading: false, data: undefined, error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { loading, data, error };
}

export function useApiPost<T>(url: string,
                              body?: any,
                              config?: AxiosRequestConfig) {
  const [{ loading, error, data }, setState] = useState<{
    loading: boolean;
    error?: any;
    data?: T;
  }>(
    { loading: true, error: undefined, data: undefined });
  useEffect(() => {
    apiPost<T>(url, body, config)
      .then(data => setState({ loading: false, error: undefined, data }))
      .catch(error => setState({ loading: false, error, data: undefined }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { loading, error, data };
}

/**
 * Sends a GET request to the app API (REST classic method).
 * @param url API URL
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export async function apiGet<T>(url: string,
                                config?: AxiosRequestConfig): Promise<T> {
  if (!url.startsWith('/')) {
    url = `/${url}`;
  }
  return httpGet(`${env.apiPath}${url}`, config);
}

/**
 * Sends a POST request to the app API.
 * @param url API URL
 * @param body body to include in the POST request
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export async function apiPost<T>(url: string, body?: any,
                                 config?: AxiosRequestConfig): Promise<T> {
  if (!url.startsWith('/')) {
    url = `/${url}`;
  }
  return httpPost(`${env.apiPath}${url}`, body, config);
}

export async function httpGet<T>(url: string,
                                 config?: AxiosRequestConfig): Promise<T> {
  return httpReq(config, url, config => axios.get<T>(url, config));
}

export async function httpPost<T>(url: string, body?: any,
                                  config?: AxiosRequestConfig): Promise<T> {
  return httpReq(config, url, config => axios.post<T>(url, body, config));
}

async function httpReq<T>(config: AxiosRequestConfig | undefined,
                          url: string,
                          sendRequest: (config: AxiosRequestConfig) => Promise<AxiosResponse<T>>): Promise<T> {
  const conf = extendConfig(config);
  let resp: AxiosResponse<T> | undefined;
  try {
    resp = await sendRequest(conf);
  } catch (e) {
    const err: AxiosError = e;
    if (!err || !err.isAxiosError || !err.response) {
      throw err;
    }
    // Retry
    if (err.response.status === 401) {
      await fetchNewJwt();
    } else {
      await wait(1000);
    }
    // tslint:disable-next-line:no-console
    console.info('Retrying HTTP request...');
    resp = await sendRequest(conf);
  }
  if (!resp) {
    console.error(`request to ${url} returned undefined. Maybe a missing mock?` +
      ' Ensure a mock is properly defined at the beginning of this test, e.g.' +
      ' `mockApiGet(() => ({}));`');
    throw new Error('Missing mock error');
  }
  return resp.data;
}

// CSRF protection if the server requires this token
const requiredHeaders = { 'X-Requested-By': appConfig.appName };
export const defaultOptions = { headers: requiredHeaders, withCredentials: appConfig.allowCorsApi }; // Useful for tests

function extendConfig(config: AxiosRequestConfig | undefined) {
  // For security, it is recommended to rely on secured cookies: keep the JWT
  // in 2 cookies (1 normal with header + payload, 1 httpOnly with signature). The server
  // concatenates the 2 cookie values to rebuild the full JWT. Server-side logout removes the 2
  // cookies, client-side logout removes the public cookie only.
  const { headers, ...otherConf } = config || {} as AxiosRequestConfig;
  return {
    ...otherConf,
    withCredentials: appConfig.allowCorsApi,
    headers: {
      ...headers,
      ...requiredHeaders,
    },
  };
}
