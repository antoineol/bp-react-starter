import { useApolloClient } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
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

const PREFIX = 'Profile';

const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

export const Profile: FC = memo(() => {
  useReduxSub<Subscription_Root>(AUTHORS_SUB);
  const loading = useAppSelector(selectAuthorsLoading);
  const authors = useAppSelector(selectAuthors);
  const client = useApolloClient();
  const handleDelete = useCallback(e => deleteAuthor(client, e), [client]);

  return (
    <Root className={classes.root}>
      <ProfileReactHookForm />
      {loading ? (
        <Loading />
      ) : (
        <>
          <ul>
            {authors?.map(author => (
              <li key={author.id}>
                {author.name}{' '}
                <IconButton
                  aria-label='delete'
                  data-id={author.id}
                  onClick={handleDelete}
                  size='large'
                >
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>
          {!authors?.length && (
            <>
              <p>No author in the list yet. You can start adding some.</p>
              <p>Leave the name empty to get a random one.</p>
            </>
          )}
        </>
      )}
    </Root>
  );
});
