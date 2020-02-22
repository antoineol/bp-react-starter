import { KeyboardDatePicker } from '@material-ui/pickers';
import { KeyboardDatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker';
import { useField } from 'formik';
import React, { FC, memo, useCallback } from 'react';
import { onEnterFocusNextField } from '../../utils/form.utils';

interface Props extends Partial<KeyboardDatePickerProps> {
  monthPicker?: boolean;
}

const reformatDate = (date: Date) => {
  const [month, year] = [date.getMonth(), date.getFullYear()];
  return new Date(year, month, 2);
};

const DatePickerField: FC<Props> = props => {
  const { id, monthPicker, ...others } = props;
  const datePickerFormat = monthPicker ? 'MM/yyyy' : 'dd/MM/yyyy';
  const views = monthPicker ? ['year', 'month'] as any : undefined;
  // weird typing issue, cast props to any is required.
  const [field, meta, helpers] = useField(props as any);
  const { value } = meta;
  const { setValue } = helpers;
  const handleDateChange = useCallback(
    (date: Date | null) => {
      const dateValue = monthPicker && date ? reformatDate(date) : date;
      setValue(dateValue);
    }, [monthPicker, setValue]);

  if (!others.name) {
    throw new Error('name prop is expected in AppTextInput.');
  }

  return (
    <>
      <KeyboardDatePicker
        autoOk
        variant="inline"
        format={datePickerFormat}
        views={views}
        margin="normal"
        id={id || others.name}
        placeholder={'YYYY-MM-DD'}
        {...others}
        {...field}
        value={value || null}
        onKeyDown={onEnterFocusNextField}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'Change date',
          tabIndex: -1, // Calendar icon not focusable via tab
        }}
      />
    </>
  );
};

export default memo(DatePickerField);
