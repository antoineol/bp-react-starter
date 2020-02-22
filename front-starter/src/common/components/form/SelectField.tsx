import { TextField, TextFieldProps } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useField } from 'formik';
import memoizeOne from 'memoize-one';
import React, { ChangeEvent, FC, memo, useCallback } from 'react';
import { onEnterFocusNextField } from '../../utils/form.utils';

interface Option {
  label: string;
  value: any;
}

interface ExtraProps {
  version?: string;
  name: string;
  label: string;
  options: Option[];
}

// type AutoComplProps = AutocompleteProps<Option> & UseAutocompleteProps<Option>;

const getSelectValue = memoizeOne(
  (options: Option[], value: string) => options.find(option => option.value === value));

const SelectField: FC<TextFieldProps & ExtraProps> = props => {
  const { id, options, ...others } = props;
  // weird typing issue, cast props to any is required.
  const [field, meta] = useField(props as any);
  const { value, touched, error } = meta;
  const { onChange, ...fieldOthers } = field; // TODO continue from here
  const handleChange = useCallback((e: ChangeEvent<{}>, selectedOption: Option | null) => {
    const value = selectedOption ? selectedOption.value : '';
    onChange(value);
  }, [onChange]);

  if (!others.name) {
    throw new Error('name prop is expected in SelectField.');
  }

  return (
    <Autocomplete
      {...fieldOthers}
      multiple={false} // This implementation of getSelectValue does not support multiple values
      options={options}
      value={getSelectValue(options, value) || null}
      getOptionLabel={option => option.label}
      autoHighlight
      onChange={handleChange}
      onKeyDown={onEnterFocusNextField}
      renderInput={params => (
        <TextField
          id={id || others.name}
          {...others}
          {...params}
          variant="standard"
          fullWidth
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password',
          }}
          error={touched && !!error}
          helperText={touched && error}
        />
      )}
    />
  );
};

export default memo(SelectField);
