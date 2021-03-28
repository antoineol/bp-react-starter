import { TextField, TextFieldProps } from '@material-ui/core';
import React, { FC, memo } from 'react';
import { useWatchErrors } from '../../../features/form-builder/WatchErrors';
import { onEnterFocusNextField } from '../../utils/form.utils';

type ModelName = string; // We could be more specific.

export type TextFieldBaseProps = Omit<TextFieldProps, 'name'> & {
  name: ModelName;
  register?: any;
  textarea?: boolean;
};

export const TextFieldBase: FC<TextFieldBaseProps & { isFocused?: boolean }> = memo(
  props => {
    let { id, name, register, textarea, isFocused, inputProps, ...others } = props;
    const touched = true;
    const { ref, ...reg } = register(name);
    inputProps = inputProps || {};
    inputProps.ref = ref;

    const error = useWatchErrors(name);

    // const control = useWatchErrorsContext();
    // const { fieldState: { error } } = useController({
    //   name,
    //   control,
    // });

    // const { errors: { [name]: error } } = useFormState({ control });

    const errorMessage = error?.message;
    // console.log(`[${name}] render - error:`, error?.message);

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
