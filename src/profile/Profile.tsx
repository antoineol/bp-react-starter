import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { Fragment, memo } from 'react';
import { Subscription_Root } from '../../hasura/gen/types';
import ErrorComp from '../common/components/ErrorComp';

const authorsSub = gql`subscription { author { id, name } }`;

function Profile() {
  const { data, loading, error } = useSubscription<Subscription_Root>(authorsSub);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error || !data) {
    return <ErrorComp error={error} />;
  }
  const authors = data!.author;

  return <Fragment>
    <ul>
      {authors.map(author => <li key={author.id}>{author.id}: {author.name}</li>)}
    </ul>
    {/*<Button
      variant={'outlined'}
      color={'primary'}
      onClick={handleClick}>
      Upvote
    </Button>*/}
  </Fragment>;
}

export default memo(Profile);
