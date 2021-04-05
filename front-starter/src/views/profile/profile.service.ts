import { ApolloClient } from '@apollo/client';
import { gql } from '@apollo/client/core';
import { MouseEvent } from 'react';
import { Author } from '../../../generated/schema';
import { createHasuraSelector } from '../../features/hasura/redux-apollo-slice';

export const AUTHORS_Q = gql`query { author { id, name } }`;
export const AUTHORS_SUB = gql`subscription { author { id, name } }`;
export const ADD_AUTHOR = gql`mutation ($object: author_insert_input! ) {
  insert_author(objects: [$object]) {
    affected_rows
  }
}`;
export const DELETE_AUTHOR = gql`mutation ($id: uuid) {
  delete_author(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`;

export interface NewAuthor {
  name?: string;
  age: number;
}

export function addAuthor(client: ApolloClient<any>, values: NewAuthor) {
  const formName = values.name;
  const name = formName ? formName : pickRandom(names);
  const author: Partial<Author> = { name }; // TODO: add age
  return client.mutate({
    mutation: ADD_AUTHOR,
    variables: { object: author },
  });
}

export function deleteAuthor(client: ApolloClient<any>, e: MouseEvent<HTMLButtonElement>) {
  const id = e.currentTarget.dataset.id;
  return client.mutate({
    mutation: DELETE_AUTHOR,
    variables: { id },
  });
}

const names = ['Parker', 'Stark', 'Herbert', 'Kennedy', 'Hammond', 'Moore', 'Holland'];

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const selectAuthors = createHasuraSelector(state => state.values.author);
export const selectAuthorsLoading = createHasuraSelector(state => state.loadings.author);
