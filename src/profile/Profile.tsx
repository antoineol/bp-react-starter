import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../common/app.utils';
import { AuthorAT, selectAuthorError, selectAuthors, selectLoadingAuthor } from './author.service';

function Profile() {
  const dispatch = useAppDispatch(); // Redux dispatcher
  useEffect(() => {
    dispatch(AuthorAT.Load);
  }, [dispatch]);
  const authors = useSelector(selectAuthors);
  const loadingAuthors = useSelector(selectLoadingAuthor);
  const authorError = useSelector(selectAuthorError);

  if (loadingAuthors) {
    return <p>Loading...</p>;
  }
  if (authorError || !authors) {
    return <div>{authorError}</div>;
  }
  // TODO
  //  Check if model can be shared with api

  return <div>
    <ul>
      {authors.map(author => <li key={author.id}>{author.firstName}</li>)}
    </ul>
  </div>;
}

export default memo(Profile);
