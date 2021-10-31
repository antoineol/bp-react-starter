import { useApolloClient } from '@apollo/client';
import { IconButton, makeStyles, Theme } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { FC, memo, useCallback } from 'react';
import { Subscription_Root } from '../../../generated/schema';
import { Loading } from '../../common/components/Loading';
import { useReduxSub } from '../../common/utils/graphql.utils';
import { useAppSelector } from '../../core/redux/hooks';
import {
  AUTHORS_SUB,
  deleteAuthor,
  selectAuthors,
  selectAuthorsLoading,
} from './profile.service';
import { ProfileReactHookForm } from './ProfileReactHookForm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: theme.spacing(2),
  },
}));

export const Profile: FC = memo(() => {
  const classes = useStyles(); // MUI Styles
  useReduxSub<Subscription_Root>(AUTHORS_SUB);
  const loading = useAppSelector(selectAuthorsLoading);
  const authors = useAppSelector(selectAuthors);
  const client = useApolloClient();
  const handleDelete = useCallback((e) => deleteAuthor(client, e), [client]);

  return (
    <div className={classes.root}>
      <ProfileReactHookForm />
      {loading ? (
        <Loading />
      ) : (
        <>
          <ul>
            {authors?.map((author) => (
              <li key={author.id}>
                {author.name}{' '}
                <IconButton
                  aria-label="delete"
                  data-id={author.id}
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
});
