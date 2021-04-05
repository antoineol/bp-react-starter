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

export function formConfigToFields(formConfig: FormConfig, register: UseFormRegister<any>,
                                   errors: any): JSX.Element[] {
  return Object.entries(formConfig).map(([name, model]) => {
    switch (model.type) {
      case 'text':
        return makeFieldText(name, model, register, errors);
      case 'number':
        return makeFieldNumber(name, model, register, errors);
      default:
        throw new Error(`Unsupported field type ${(model as any).type}`);
    }
  });
}

// TODO warning from Apollo
// react_devtools_backend.js:2430 Cache data may be lost when replacing the author field of a
// Subscription object.  To address this problem (which is not a bug in Apollo Client), define a
// custom merge function for the Subscription.author field, so InMemoryCache can safely merge these
// objects:  existing:
// [{"__ref":"author:0618b680-006f-4654-b2ed-7df3a4fc1c47"},{"__ref":"author:ea8268de-8b03-4b8f-b338-e3d9b23543fa"},{"__ref":"author:c599d264-61dc-457f-9e2f-35b79ddc2cb9"},{"__ref":"author:40e3542d-4720-459a-8e20-31a118da4c59"},{"__ref":"author:520a98d4-db4c-4932-8a2f-ae5b6747ca7b"}]
// incoming:
// [{"__ref":"author:0618b680-006f-4654-b2ed-7df3a4fc1c47"},{"__ref":"author:ea8268de-8b03-4b8f-b338-e3d9b23543fa"},{"__ref":"author:c599d264-61dc-457f-9e2f-35b79ddc2cb9"},{"__ref":"author:520a98d4-db4c-4932-8a2f-ae5b6747ca7b"}]
// For more information about these options, please refer to the documentation:  * Ensuring entity
// objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers * Defining custom merge
// functions: https://go.apollo.dev/c/merging-non-normalized-objects
