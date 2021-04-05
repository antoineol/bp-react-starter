import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/styles';
import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { Subscription_Root } from '../../../generated/schema';
import { useReduxSub } from '../../common/utils/graphql.utils';
import { selectHasuraValues } from '../../features/hasura/redux-apollo-slice';
import { AUTHORS_SUB } from './profile.service';


// import ProfileFooter from './ProfileFooter';

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

export const Profile: FC = memo(() => {
  // // const { loading, error, data } = useSubscription<Subscription_Root>(AUTHORS_SUB);
  // const { loading, error, data } = useSub<Subscription_Root>(AUTHORS_SUB);
  // console.log('[loading]', loading, '[error]', error, '[data]', data?.author[1].name);
  useReduxSub<Subscription_Root>(AUTHORS_SUB);
  // console.log('[Profile render]');
  const values = useSelector(selectHasuraValues);
  // console.log('Profile values:', values);
  console.log('Profile values:', values?.author?.[1]?.name);

  // const subscription = AUTHORS_SUB;
  // const query = subscriptionToQuery(subscription);
  // console.log('sub:', subscription.loc!.source.body);
  // console.log('query:', query.loc!.source.body);
  // const { loading, error, data, subscribeToMore, networkStatus, previousData, called,  } =
  // useQuery<Subscription_Root>(query); useEffect(() => { subscribeToMore({ document:
  // subscription, updateQuery: (prev, { subscriptionData }) => subscriptionData?.data ?
  // subscriptionData.data : prev }) }, []); console.log('[loading]', loading, '[error]', error,
  // '[data]', data?.author[1].name, '[networkStatus]', networkStatus, '[previousData]',
  // previousData?.author[1].name, '[called]', called);

  return <>Foo</>;

  // // TODO replace subscription with query and use cache (with redux or apollo)
  // const classes = useStyles(); // MUI Styles
  // const { data, loading, error } = useQuery<Query_Root>(AUTHORS_Q);
  // // Subscription equivalent:
  // // const { data, loading, error } = useSubscription<Subscription_Root>(AUTHORS_SUB);
  // const authors = data?.author ?? [];
  //
  // // Below mutations are called with refetchQueries  (in profile.service). It will re-trigger the
  // // query after the mutation, which will update the component with updated server data. This is
  // // useful when using queries instead of subscriptions to update local data with latest server
  // // data after the mutation is done.
  // // The interest of useMutation is to get loading status and error directly in the component.
  // // If you don't care getting them here (because you just don't care or you prefer using a
  // // global service), you should use apiMutate instead to avoid useless renderings of this
  // // component.
  // const [addMutator, { error: errAdd }] = useMutation<Mutation_Root>(ADD_AUTHOR);
  // const [delMutator, { error: errDel }] = useMutation<Mutation_Root>(DELETE_AUTHOR);
  // const handleAdd = useCallback(addAuthor(addMutator), []);
  // const handleDelete = useCallback(deleteAuthor(delMutator), []);
  //
  // if (error) return <ErrorComp error={error} />;
  //
  // return <div className={classes.root}>
  //   Foo
  //   <Formik
  //     initialValues={newAuthorDefaults}
  //     validationSchema={newAuthorSchema}
  //     onSubmit={handleAdd}
  //   >
  //     <Form className={classes.form}>
  //       <div style={{ margin: '10px' }}>
  //         <AppTextField name="name" label="Name" autoFocus />
  //       </div>
  //       <div style={{ margin: '10px' }}>
  //         <AppTextField name="age" label="Age" type={'number'} />
  //       </div>
  //       <div style={{ margin: '10px' }}>
  //         <Button variant="outlined" color="primary" type="submit" className={classes.submitBtn}>
  //           Add author
  //         </Button>
  //       </div>
  //     </Form>
  //   </Formik>
  //   {
  //     // loading
  //     // ? <CircularProgress/>
  //     // : <>
  //     //   <ul>
  //     //     {authors.map(author => <li key={author.id}>{author.name} <IconButton
  //     //       aria-label="delete"
  //     //       data-id={author.id}
  //     //       onClick={handleDelete}>
  //     //       <DeleteIcon/>
  //     //     </IconButton></li>)}
  //     //   </ul>
  //     //   <ProfileFooter/>
  //     // </>
  //   }
  //   {/*<ErrorComp error={[error, errAdd, errDel]}/>*/}
  // </div>;
});
