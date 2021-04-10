import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, memo, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { formConfigToFields, formConfigToYup } from './form-builder-all-types';
import { FormConfig } from './form-builder.model';
import { WatchErrorsProvider } from './WatchErrors';

interface Props {
  onSubmit: SubmitHandler<any>;
  formConfig: FormConfig;
  className: string;
}

export const FormBuilder: FC<Props> = memo(props => {
  const { className, onSubmit, formConfig, children } = props;

  const [schema, defaults] = useMemo(() => formConfigToYup(formConfig), [formConfig]);

  const methods = useForm({
    defaultValues: defaults,
    resolver: yupResolver(schema),
    mode: 'onChange',
    // reValidateMode: 'onChange',
  });

  const { handleSubmit, register } = methods;

  const fields = useMemo(() => formConfigToFields(formConfig, register),
    [formConfig, register]);

  return <WatchErrorsProvider control={methods.control}>
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {fields}
      {children}
    </form>
  </WatchErrorsProvider>;
});
