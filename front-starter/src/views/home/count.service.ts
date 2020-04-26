import { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { appConfig } from '../../common/app.config';
import { createCacheSelector, readCache, writeCache } from '../../common/cache/cache.utils';
import { httpGet } from '../../common/utils/http.utils';

export interface TodoItem {
  id: number;
  title: string;
}

export const selectCount = createCacheSelector(cache => cache.get('home').get('count'));

export async function incrementCount(e: MouseEvent) {
  e.preventDefault();
  const count = readCacheCount();

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
  const count = readCacheCount();
  writeCache({ home: { count: count * 2 } });
}

export function changeCount(e: ChangeEvent<HTMLInputElement>, count: number) {
  e.preventDefault();
  writeCache({ home: { count } });
}

function readCacheCount() {
  return readCache(cache => cache.get('home').get('count'));
}
