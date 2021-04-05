import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import * as yup from 'yup';
import { TextFieldBase } from '../../../common/components/form/TextFieldBase';
import { CommonConfig } from '../form-builder.model';

const type = 'text' as const;

export interface TextFieldConfig extends CommonConfig {
  type: typeof type;
  default?: string;
  min?: number;
  max?: number;
}

export function makeYupText(fieldConfig: TextFieldConfig): yup.AnySchema {
  if (fieldConfig.type !== type) throw new Error(
    `Expected config type ${type}, got ${fieldConfig.type}`);
  let y = yup.string();
  const m = fieldConfig;
  if (m.required) y = y.required();
  if (m.min != null) y = y.min(m.min);
  if (m.max != null) y = y.max(m.max, 'Must be 15 characters or less');
  if (m.default != null) y = y.default(m.default);
  return y;
}

export function makeFieldText(name: string, fieldConfig: TextFieldConfig,
                              register: UseFormRegister<any>,
                              errors: any): JSX.Element {
  return <TextFieldBase
    key={name}
    name={name}
    errorMessage={errors[name]?.message}
    register={register}
    label={fieldConfig.label}
    autoFocus={fieldConfig.autoFocus}
  />;
}
