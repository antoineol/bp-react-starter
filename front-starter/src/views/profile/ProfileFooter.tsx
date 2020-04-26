import { Typography } from '@material-ui/core';
import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthorNames, selectAuthors } from './profile.service';

const ProfileFooter: FC = memo(() => {
  const nbAuthors = useSelector(selectAuthors)?.length || 0;
  const authorNames = useSelector(selectAuthorNames);
  console.log('authorNames:', authorNames);
  return <Typography>{nbAuthors} author{nbAuthors > 1 ? 's' : ''}</Typography>;
});

export default ProfileFooter;
