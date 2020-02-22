import { TextField, TextFieldProps } from '@material-ui/core';
import { useField } from 'formik';
import React, { FC, memo } from 'react';
import { logRenderForPerfInvestigation } from '../../utils/app.utils';
import { onEnterFocusNextField } from '../../utils/form.utils';

const AppTextField: FC<TextFieldProps> = props => {
  const { id, ...others } = props;
  logRenderForPerfInvestigation();
  const [field, meta] = useField(props as any); // weird typing issue, cast to any is required.
  const { touched, error } = meta;

  if (!others.name) {
    throw new Error('name prop is expected in AppTextInput.');
  }

  return (
    <TextField id={id || others.name}
               {...others}
               {...field}
               error={touched && !!error}
               helperText={touched && error}
               onKeyDown={onEnterFocusNextField}
    />
  );
};

export default memo(AppTextField);
