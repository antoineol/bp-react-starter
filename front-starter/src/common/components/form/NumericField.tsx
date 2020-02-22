import { TextField, TextFieldProps } from '@material-ui/core';
import { useField } from 'formik';
import React, { FC, memo } from 'react';
import { onEnterFocusNextField } from '../../utils/form.utils';

interface Props {
  isPercentage?: boolean;
}

const NumericInput: FC<TextFieldProps & Props> = props => {
  const { id, isPercentage, ...others } = props;
  const [field, meta] = useField(props as any); // weird typing issue, cast to any is required.
  const { value, onChange, ...fieldOthers } = field;
  const { touched, error } = meta;
  let displayedValue = !value && value !== 0 ? '' : isPercentage ? value * 100 : value;
  // round number to avoid weird javascript behavior with floating numbers
  if (typeof displayedValue === 'number') {
    displayedValue = Math.round((displayedValue + Number.EPSILON) * 1000000000000) / 1000000000000;
  }

  if (!others.name) {
    throw new Error('name prop is expected in AppTextInput.');
  }
  const percentageSign = isPercentage ? <span> % </span> : '';

  return (
    <div>
      <TextField id={id || others.name}
                 {...others}
                 {...fieldOthers}
                 type={'number'}
                 value={displayedValue}
                 error={touched && !!error}
                 helperText={touched && error}
                 onChange={e => {
                   if (e.target.value !== '') {
                     const value: number = parseFloat(e.currentTarget.value);
                     const finalValue = isPercentage ? value / 100 : value;
                     e.target.value = finalValue.toString();
                   }
                   if (onChange) onChange(e);
                 }}
                 onKeyDown={onEnterFocusNextField}
      />
      {percentageSign}
    </div>
  );
};

export default memo(NumericInput);
