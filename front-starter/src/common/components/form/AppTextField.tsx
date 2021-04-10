import { TextField, TextFieldProps } from '@material-ui/core';
import { FastField, FieldProps } from 'formik';
import React, { FC, memo } from 'react';
import { onEnterFocusNextField } from '../../utils/form.utils';
import { logRenderForPerfInvestigation } from '../../utils/perf.utils';

export const AppTextField: FC<TextFieldProps> = memo(props => <FastField name={props.name}>
  {({
      field,
      meta: { touched, error },
    }: FieldProps<string>) => {
    // If hooks are required here, consider moving this code to a separate functional component
    // that you return here, passing props you need.
    const { id, ...others } = props;
    logRenderForPerfInvestigation();

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
  }
  }</FastField>);
