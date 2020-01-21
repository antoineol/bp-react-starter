import { DataProxy } from 'apollo-cache';
import { DocumentNode, FetchResult } from 'apollo-link';
import { OperationDefinitionNode } from 'graphql';
import gql from 'graphql-tag';
import { MouseEvent } from 'react';
import { Author, Mutation_Root, Subscription_Root } from '../../hasura/gen/types';
import { getGqlClient } from '../common/graphql.client';
import { Mutator } from '../common/models/app.models';

// TODO KO because it is a subscription. Works if replacing with query and
//  replace useSubscription with useQuery in Profile component.
//  Current implementation updates subscription cache, but useSubscription don't
//  take it into account.
export const AUTHORS_SUB = gql`subscription { author { id, name } }`;
export const ADD_AUTHOR = gql`mutation insert_author($object: author_insert_input! ) {
  insert_author(objects: [$object]) {
    affected_rows
  }
}`;
export const DELETE_AUTHOR = gql`mutation delete_author($id: uuid) {
  delete_author(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`;

export function addAuthor(mutator: Mutator<Mutation_Root>) {
  return async (e: MouseEvent) => {
    const name = pickRandom(names);
    const author: Partial<Author> = { name };
    return mutator({
      variables: { object: author },
      update: optimisticInsertCacheUpdate(
        { object: author, query: AUTHORS_SUB, rootField: 'author' }),
    });
  };
}

export function deleteAuthor(mutator: Mutator<Mutation_Root>) {
  return async (e: MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id;
    return mutator({
      variables: { id },
      update: optimisticDeleteCacheUpdate({ id, query: AUTHORS_SUB, rootField: 'author' }),
    });
  };
}

const names = ['Parker', 'Stark', 'Herbert', 'Kennedy', 'Hammond', 'Moore', 'Holland'];

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function optimisticInsertCacheUpdate<T>(
  { query, rootField, object, idField }:
    { query: DocumentNode, rootField: keyof Subscription_Root, object: T, idField?: string }) {
  return optimisticCacheUpdateOperation({
    query, rootField, idField, operation: (cacheEntities, id) => {
      // Merge old and new
      const completedObj = { ...object, [id]: uuidv4(), __typename: rootField };
      return [...cacheEntities, completedObj];
    },
  });
}

function optimisticDeleteCacheUpdate<T>(
  { query, rootField, id, idField }:
    { query: DocumentNode, rootField: keyof Subscription_Root, id: any, idField?: keyof T }) {
  return optimisticCacheUpdateOperation({
    query, rootField, idField, operation: (cacheEntities, idF) => {
      return cacheEntities.filter(entity => entity[idF] !== id);
    },
  });
}

function optimisticCacheUpdateOperation<T = any>(
  { query, rootField, idField, operation }:
    {
      query: DocumentNode, rootField: keyof Subscription_Root, operation: (cacheEntities: T[],
                                                                           id: keyof T) => T[], object?: T, idField?: keyof T,
    }) {
  const id = idField || 'id';
  return (cache: DataProxy, { data }: FetchResult<Mutation_Root>) => {
    // Fetch the existing entities from the cache
    const q = subscriptionToQuery(query);
    let cacheEntities: Subscription_Root | null = getGqlClient().cache
      .read({ query: q, optimistic: true, rootId: 'ROOT_SUBSCRIPTION' });
    if (!cacheEntities) {
      cacheEntities = { [rootField]: [] } as unknown as Subscription_Root;
    }
    if (!data) {
      return;
    }
    // @ts-ignore
    const newEntities = operation(cacheEntities[rootField], id);
    getGqlClient().cache
      .write({ query: q, result: { [rootField]: newEntities }, dataId: 'ROOT_SUBSCRIPTION' });
  };
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable-next-line:one-variable-per-declaration no-bitwise
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function subscriptionToQuery(subscription: DocumentNode): DocumentNode {
  console.log(subscription);
  return {
    ...subscription, definitions: subscription.definitions.map((def) => {
      const op = def as OperationDefinitionNode;
      if (op.kind === 'OperationDefinition' && op.operation === 'subscription') {
        return { ...op, operation: 'query' };
      }
      return op;
    }),
  };
}
