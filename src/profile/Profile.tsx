import { useMutation, useSubscription } from '@apollo/react-hooks';
import {
  Button,
  CircularProgress,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { CSSProperties } from '@material-ui/styles';
import React, { memo, useCallback } from 'react';
import { Mutation_Root, Subscription_Root } from '../../hasura/gen/types';
import ErrorComp from '../common/components/ErrorComp';
import { ADD_AUTHOR, addAuthor, AUTHORS_SUB, DELETE_AUTHOR, deleteAuthor } from './profile.service';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  } as CSSProperties,
}));

function Profile() {
  const classes = useStyles(); // MUI Styles
  const { data: dataAuthors, loading: loadingSub, error } = useSubscription<Subscription_Root>(
    AUTHORS_SUB);
  const [addMutator, { error: errAdd }] = useMutation<Mutation_Root>(ADD_AUTHOR);
  const handleClick = useCallback(addAuthor(addMutator), []);
  const [delMutator, { error: errDel }] = useMutation<Mutation_Root>(DELETE_AUTHOR);
  const handleDelete = useCallback(deleteAuthor(delMutator), []);

  if (!dataAuthors) {
    return <ErrorComp error={error} />;
  }
  const authors = dataAuthors!.author;

  return <div className={classes.root}>
    <Button
      variant={'outlined'}
      color={'primary'}
      onClick={handleClick}>
      Add author
    </Button>
    {loadingSub
      ? <CircularProgress />
      : <ul>
        {authors.map(author => <li key={author.id}>{author.name} <IconButton
          aria-label="delete"
          data-id={author.id}
          onClick={handleDelete}>
          <DeleteIcon />
        </IconButton></li>)}
      </ul>}
    <ErrorComp error={error} />
    <ErrorComp error={errAdd} />
    <ErrorComp error={errDel} />
  </div>;
}

export default memo(Profile);
