import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { memo } from 'react';
import { Subscription_Root } from '../../hasura/gen/types';

const authorsSub = gql`subscription { author { id, name } }`;

// const authorsQuery = gql`query { author { id, name } }`;

function Profile() {
  const { data, loading, error } = useSubscription<Subscription_Root>(authorsSub);
  // const { data, loading, error } = useQuery<Subscription_Root>(authorsQuery);
  // const data = {author: [] as {id: string, name: string}[]};
  // const error = null;
  // const loading = false;

  // const dispatch = useAppDispatch(); // Redux dispatcher
  // const handleClick = useCallback(() => dispatch(AuthorAT.Upvote), [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error || !data) {
    return <div>{JSON.stringify(error)}</div>;
  }
  const authors = data!.author;

  return <div>
    <ul>
      {authors.map(author => <li key={author.id}>{author.id}: {author.name}</li>)}
    </ul>
    {/*<Button
      variant={'outlined'}
      color={'primary'}
      onClick={handleClick}>
      Upvote
    </Button>*/}
  </div>;
}

export default memo(Profile);
