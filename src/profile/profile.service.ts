import gql from 'graphql-tag';
import { MouseEvent } from 'react';
import { Mutation_Root } from '../../hasura/gen/types';
import { Mutator } from '../common/models/app.models';

export const AUTHORS_SUB = gql`subscription { author { id, name } }`;
// TODO try to remove returning{}...
export const ADD_AUTHOR = gql`mutation insert_author($object: author_insert_input! ) {
    insert_author(objects: [$object]) {
        returning {
            id
            name
        }
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
    return mutator({
      variables: { object: { name } },
      // optimisticResponse: undefined,
      // update: (proxy, mutationResult) => {
      //   console.log('proxy:', proxy);
      //   console.log('mutationResult:', mutationResult);
      // }
    });
  };
}

export function deleteAuthor(mutator: Mutator<Mutation_Root>) {
  return async (e: MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id;
    return mutator({ variables: { id } });
  };
}

const names = ['Parker', 'Stark', 'Herbert', 'Kennedy', 'Hammond', 'Moore', 'Holland'];

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
