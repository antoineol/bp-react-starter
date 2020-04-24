import { useMutation, useQuery } from '@apollo/react-hooks';
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
import { Form, Formik } from 'formik';
import React, { FC, memo, useCallback } from 'react';
import { Mutation_Root, Query_Root } from '../../../generated/schema';
import ErrorComp from '../../common/components/ErrorComp';
import AppTextInput from '../../common/components/form/AppTextField';
import {
  ADD_AUTHOR,
  addAuthor,
  AUTHORS_Q,
  DELETE_AUTHOR,
  deleteAuthor,
  newAuthorDefaults,
  newAuthorSchema,
} from './profile.service';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: theme.spacing(2),
  } as CSSProperties,
  form: {
    display: 'flex',
    alignItems: 'baseline',
  },
  submitBtn: {
    marginLeft: theme.spacing(1),
  },
}));

const Profile: FC = memo(() => {
  // TODO replace subscription with query and use cache (with redux or apollo)
  const classes = useStyles(); // MUI Styles
  const { data, loading, error } = useQuery<Query_Root>(AUTHORS_Q);
  // const { data, loading, error } = useSubscription<Subscription_Root>(AUTHORS_SUB);
  const authors = data?.author ?? [];
  // Mutations with refetchQueries will re-trigger the query after the mutation, which will
  // update the component with updated server data.
  const [addMutator, { error: errAdd }] = useMutation<Mutation_Root>(ADD_AUTHOR);
  const [delMutator, { error: errDel }] = useMutation<Mutation_Root>(DELETE_AUTHOR);
  const handleAdd = useCallback(addAuthor(addMutator), []);
  const handleDelete = useCallback(deleteAuthor(delMutator), []);

  if (error) return <ErrorComp error={error}/>;

  return <div className={classes.root}>
    <Formik
      initialValues={newAuthorDefaults}
      validationSchema={newAuthorSchema}
      onSubmit={handleAdd}
    >
      <Form className={classes.form}>
        <div style={{ margin: '10px' }}>
          <AppTextInput name="name" label="Name" autoFocus/>
        </div>
        <div style={{ margin: '10px' }}>
          <AppTextInput name="age" label="Age" type={'number'}/>
        </div>
        <div style={{ margin: '10px' }}>
          <Button variant="outlined" color="primary" type="submit" className={classes.submitBtn}>
            Add author
          </Button>
        </div>
      </Form>
    </Formik>
    {loading
      ? <CircularProgress/>
      : <ul>
        {authors.map(author => <li key={author.id}>{author.name} <IconButton
          aria-label="delete"
          data-id={author.id}
          onClick={handleDelete}>
          <DeleteIcon/>
        </IconButton></li>)}
      </ul>}
    <ErrorComp error={[error, errAdd, errDel]}/>
  </div>;
});

export default Profile;
