import { UseFormRegister } from 'react-hook-form';
import * as yup from 'yup';
import { makeFieldNumber, makeYupNumber, NumberFieldConfig } from './fieldTypes/NumberFieldDef';
import { makeFieldText, makeYupText, TextFieldConfig } from './fieldTypes/TextFieldDef';
import { FormConfig } from './form-builder.model';

export type FieldModel = TextFieldConfig | NumberFieldConfig;

export function formConfigToYup(formConfig: FormConfig): [yup.AnyObjectSchema, any] {
  const schema = yup.object(Object.entries(formConfig).reduce((prev, [name, model]) => {
    switch (model.type) {
      case 'text':
        prev[name] = makeYupText(model);
        break;
      case 'number':
        prev[name] = makeYupNumber(model);
        break;
      default:
        throw new Error(`Unsupported yup type ${(model as any).type}`);
    }
    return prev;
  }, {} as any));
  const defaults = schema.getDefault();
  return [schema, defaults];
}

export function formConfigToFields(formConfig: FormConfig,
                                   register: UseFormRegister<any>): JSX.Element[] {
  return Object.entries(formConfig).map(([name, model]) => {
    switch (model.type) {
      case 'text':
        return makeFieldText(name, model, register);
      case 'number':
        return makeFieldNumber(name, model, register);
      default:
        throw new Error(`Unsupported field type ${(model as any).type}`);
    }
  });
}

