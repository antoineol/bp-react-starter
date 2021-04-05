import { TextField, TextFieldProps } from '@material-ui/core';
import React, { FC, memo } from 'react';
import { onEnterFocusNextField } from '../../utils/form.utils';

type ModelName = string; // We could be more specific.

export type TextFieldBaseProps = Omit<TextFieldProps, 'name'> & {
  name: ModelName;
  register?: any;
  textarea?: boolean;
  errorMessage?: string;
};

export const TextFieldBase: FC<TextFieldBaseProps & { isFocused?: boolean }> = memo(
  props => {
    let { id, name, register, textarea, isFocused, errorMessage, inputProps, ...others } = props;
    const touched = true;
    const { ref, ...reg } = register(name);
    inputProps = inputProps || {};
    inputProps.ref = ref;

    return <TextField
      id={id || name}
      // variant={'standard'}
      // value={value ?? null}
      // defaultValue={defaultValue ?? null}
      {...others}
      {...reg}
      inputProps={inputProps}
      error={touched && !!errorMessage}
      helperText={touched && errorMessage}
      {...(textarea && { multiline: true, rowsMax: isFocused ? undefined : 1 })}
      {...(!textarea && { onKeyDown: onEnterFocusNextField })}
    />;
  });
