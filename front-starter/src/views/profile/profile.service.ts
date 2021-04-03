import { gql } from '@apollo/client/core';
import { MouseEvent } from 'react';
import * as yup from 'yup';
import { Author, Mutation_Root } from '../../../generated/schema';
import { Mutator } from '../../common/models/app.models';
// import {
//   createApolloSelector,
//   createApolloSelectorTopLevel,
// } from '../../common/utils/redux-apollo.utils';

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

export const newAuthorSchema = yup.object({
  name: yup.string()
    .max(15, 'Must be 15 characters or less'),
  age: yup.number().min(10).max(150).default(25),
});

export const newAuthorDefaults = newAuthorSchema.getDefault();

type NewAuthor = yup.InferType<typeof newAuthorSchema>;

export function addAuthor(mutator: Mutator<Mutation_Root>) {
  return async (values: NewAuthor) => {
    const formName = values.name;
    const name = formName ? formName : pickRandom(names);
    const author: Partial<Author> = { name }; // TODO: add age
    return mutator({
      variables: { object: author },
      refetchQueries: [{ query: AUTHORS_Q }],
    });
  };
}

export function deleteAuthor(mutator: Mutator<Mutation_Root>) {
  return async (e: MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id;
    return mutator({
      variables: { id },
      refetchQueries: [{ query: AUTHORS_Q }],
    });
  };
}

const names = ['Parker', 'Stark', 'Herbert', 'Kennedy', 'Hammond', 'Moore', 'Holland'];

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// // Sample redux selector to read data from cache
// export const selectAuthors = createApolloSelectorTopLevel('author');
// export const selectAuthorNames = createApolloSelector('author',
//   val => val.map(elt => elt.get('name')));
