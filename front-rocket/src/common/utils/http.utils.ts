import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '../../environment/env';
import { showSignIn } from '../../views/auth/auth.service';
import { appConfig } from '../app.config';
import { wait } from './app.utils';

/**
 * Sends a GET request to the app API (REST classic method).
 * @param url API URL
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export async function apiGet<T>(url: string,
                                config?: AxiosRequestConfig): Promise<T> {
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
      await showSignIn();
    } else {
      await wait(1000);
    }
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
const requiredHeaders = { 'X-Requested-By': appConfig.securityRequestedByHeader };
export const defaultOptions = { headers: requiredHeaders }; // Useful for tests

function extendConfig(config: AxiosRequestConfig | undefined) {
  // For security, it is recommended to rely on secured cookies: keep the JWT
  // in 2 cookies (1 normal with header + payload, 1 httpOnly with signature). The server
  // concatenates the 2 cookie values to rebuild the full JWT. Server-side logout removes the 2
  // cookies, client-side logout removes the public cookie only.
  const { headers, ...otherConf } = config || {} as AxiosRequestConfig;
  return {
    ...otherConf,
    headers: {
      ...headers,
      ...requiredHeaders,
    },
  };
}