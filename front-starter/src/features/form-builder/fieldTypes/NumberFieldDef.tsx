import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import * as yup from 'yup';
import { TextFieldBase } from '../../../common/components/form/TextFieldBase';
import { CommonConfig } from '../form-builder.model';

const type = 'number' as const;

export interface NumberFieldConfig extends CommonConfig {
  type: typeof type;
  default?: number;
  min?: number;
  max?: number;
}

export function makeYupNumber(fieldConfig: NumberFieldConfig): yup.AnySchema {
  if (fieldConfig.type !== type) throw new Error(
    `Expected config type ${type}, got ${fieldConfig.type}`);
  let y = yup.number();
  const m = fieldConfig;
  if (m.required) y = y.required();
  if (m.min != null) y = y.min(m.min);
  if (m.max != null) y = y.max(m.max);
  if (m.default != null) y = y.default(m.default);
  return y;
}

export function makeFieldNumber(name: string, fieldConfig: NumberFieldConfig,
                                register: UseFormRegister<any>,
                                errors: any): JSX.Element {
  return <TextFieldBase
    key={name}
    name={name}
    errorMessage={errors[name]?.message}
    register={register}
    label={fieldConfig.label}
    type={'number'}
    autoFocus={fieldConfig.autoFocus}
  />;
}
