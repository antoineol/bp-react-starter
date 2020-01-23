import { TextField, TextFieldProps } from '@material-ui/core';
import { useField } from 'formik';
import React, { FC, memo } from 'react';

// For all other form components (select, checkbox...), you can create a wrapper like this to
// simplify Formik usage.
const AppTextInput: FC<TextFieldProps> = ({ id, ...props }) => {
  const [field, meta] = useField(props as any); // weird typing issue, cast to any is required.
  const { touched, error } = meta;
  return (
    <TextField id={id || props.name}
               {...field}
               {...props}
               error={touched && !!error}
               helperText={touched && error}
    />
  );
};

export default memo(AppTextInput);
