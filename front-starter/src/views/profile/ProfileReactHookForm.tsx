import { useApolloClient } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, makeStyles, Theme } from '@material-ui/core';
import React, { FC, memo, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { formConfigToFields, formConfigToYup } from '../../features/form-builder/form-builder';
import { FormConfig } from '../../features/form-builder/form-builder.model';
import { addAuthor, NewAuthor } from './profile.service';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
}));

const formConfig: FormConfig = {
  name: { type: 'text', label: 'Name', autoFocus: true },
  job: { type: 'text', label: 'Job' },
  age: { type: 'number', label: 'Age', min: 10, max: 150, default: 25 },
};

export const ProfileReactHookForm: FC = memo(() => {
  const classes = useStyles(); // MUI Styles

  const [schema, defaults] = useMemo(() => formConfigToYup(formConfig), []);

  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: defaults,
    resolver: yupResolver(schema),
    mode: 'onChange',
    // reValidateMode: 'onChange',
  });

  // TODO make a useReduxMutation to avoid useless renderings?
  // const [addMutator, { error: errAdd }] = useMutation<Mutation_Root>(ADD_AUTHOR);
  // if (errAdd) {
  //   console.error(errAdd);
  // }
  const client = useApolloClient();
  const onSubmit = useCallback((values: NewAuthor) => addAuthor(client, values), [client]);
  console.log('errors:', errors);
  // TODO when a validation disappears on the 2nd component, the first should not re-render.
  //  Let's see how we can only re-render the components that need to for this case.

  const fields = useMemo(() => formConfigToFields(formConfig, register, errors),
    [errors, register]);

  return <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
    {fields}
    <Button variant="outlined" color="default" type="submit">
      Add author
    </Button>
  </form>;
});
