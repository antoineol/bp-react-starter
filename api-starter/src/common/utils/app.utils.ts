import { Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const logger = new Logger('app.utils');

export class ErrorWithStatus extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export function errWithStatus(message: string, status: number): ErrorWithStatus {
  return new ErrorWithStatus(message, status);
}

export async function wait(ms?: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sends a GET request.
 * @param url Remote resource URL
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export async function httpGet<T>(url: string,
                                 config?: AxiosRequestConfig): Promise<T> {
  return httpReq(config, url, config => axios.get<T>(url, config));
}

/**
 * Sends a POST request.
 * @param url Remote resource URL
 * @param body Request body
 * @param config eventual Axios config, e.g. to add custom HTTP headers
 */
export async function httpPost<T>(url: string, body?: any,
                                  config?: AxiosRequestConfig): Promise<T> {
  return httpReq(config, url, config => axios.post<T>(url, body, config));
}

async function httpReq<T>(config: AxiosRequestConfig | undefined,
                          url: string,
                          sendRequest: (config: AxiosRequestConfig) => Promise<AxiosResponse<T>>): Promise<T> {
  let resp: AxiosResponse<T> | undefined;
  try {
    resp = await sendRequest(config);
  } catch (e) {
    const err: AxiosError = e;
    if (!err || !err.isAxiosError || !err.response) {
      throw err;
    }
    // Retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    resp = await sendRequest(config);
  }
  if (!resp) {
    logger.error(`request to ${url} returned undefined. Maybe a missing mock?` +
      ' Ensure a mock is properly defined at the beginning of this test, e.g.' +
      ' `mockApiGet(() => ({}));`');
    throw new Error('Missing mock error');
  }
  return resp.data;
}

export function flat<T>(array: T[][]): T[] {
  return [].concat(...array);
}
