import { useApolloClient } from '@apollo/client';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FC, memo, useCallback } from 'react';
import { FormConfig } from '../../features/form-builder/form-builder.model';
import { FormBuilder } from '../../features/form-builder/FormBuilder';
import { addAuthor, NewAuthor } from './profile.service';

const PREFIX = 'ProfileReactHookForm';

const classes = {
  form: `${PREFIX}-form`,
};

const StyledFormBuilder = styled(FormBuilder)(({ theme }) => ({
  [`&.${classes.form}`]: {
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
  job: { type: 'text', label: 'Job', max: 3 },
  age: { type: 'number', label: 'Age', min: 10, max: 150, default: 25 },
};

// Perf test with many fields
// for (let i = 1; i <= 100; i++) {
//   formConfig[`age${i}`] = { type: 'number', label: 'Age', min: 10, max: 150, default: 255 };
// }

export const ProfileReactHookForm: FC = memo(() => {
  const formConf = formConfig; // To simulate a dynamic config loaded from an API

  // TODO make a useReduxMutation to avoid useless renderings when we are not interested in
  //  loading and errors in the component itself?
  // const [addMutator, { error: errAdd }] = useMutation<Mutation_Root>(ADD_AUTHOR);
  // if (errAdd) {
  //   console.error(errAdd);
  // }
  const client = useApolloClient();
  const onSubmit = useCallback(
    (values: NewAuthor) => addAuthor(client, values),
    [client],
  );

  return (
    <StyledFormBuilder
      formConfig={formConf}
      onSubmit={onSubmit}
      className={classes.form}
    >
      <Button variant='outlined' type='submit'>
        Add author
      </Button>
    </StyledFormBuilder>
  );
});

// TODO warning from Apollo
// react_devtools_backend.js:2430 Cache data may be lost when replacing the author field of a
// Subscription object.  To address this problem (which is not a bug in Apollo Client), define a
// custom merge function for the Subscription.author field, so InMemoryCache can safely merge these
// objects:  existing:
// [{"__ref":"author:0618b680-006f-4654-b2ed-7df3a4fc1c47"},{"__ref":"author:ea8268de-8b03-4b8f-b338-e3d9b23543fa"},{"__ref":"author:c599d264-61dc-457f-9e2f-35b79ddc2cb9"},{"__ref":"author:40e3542d-4720-459a-8e20-31a118da4c59"},{"__ref":"author:520a98d4-db4c-4932-8a2f-ae5b6747ca7b"}]
// incoming:
// [{"__ref":"author:0618b680-006f-4654-b2ed-7df3a4fc1c47"},{"__ref":"author:ea8268de-8b03-4b8f-b338-e3d9b23543fa"},{"__ref":"author:c599d264-61dc-457f-9e2f-35b79ddc2cb9"},{"__ref":"author:520a98d4-db4c-4932-8a2f-ae5b6747ca7b"}]
// For more information about these options, please refer to the documentation:  * Ensuring entity
// objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers * Defining custom merge
// functions: https://go.apollo.dev/c/merging-non-normalized-objects
