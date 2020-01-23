import gql from 'graphql-tag';
import { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { appConfig } from '../common/app.config';
import { readCache, writeCache } from '../common/utils/app.utils';
import { httpGet } from '../common/utils/http.utils';

export interface TodoItem {
  id: number;
  title: string;
}

export const GET_COUNT = gql`{ home @client { count } }`;

export async function incrementCount(e: MouseEvent) {
  e.preventDefault();
  const { home: { count } } = readCache(GET_COUNT);

  let c: number;
  if (appConfig.useRealWebService) {
    // Let's pretend we need to get an id from remote to compute the next count
    const [{ id }]: TodoItem[] = await httpGet(`https://jsonplaceholder.typicode.com/todos`,
      { params: { id: count } });
    c = id;
  } else {
    c = count;
  }

  writeCache({ home: { count: c + 1 } });
}

export function doubleCount(e: FormEvent) {
  e.preventDefault();
  const { home: { count } } = readCache(GET_COUNT);
  writeCache({ home: { count: count * 2 } });
}

export function changeCount(e: ChangeEvent<HTMLInputElement>, count: number) {
  e.preventDefault();
  writeCache({ home: { count } });
}
