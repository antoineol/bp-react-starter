import { Dict } from '../../common/models/app.models';
import { FieldModel } from './form-builder-all-types';

export interface CommonConfig {
  label: string;
  required?: boolean;
  autoFocus?: boolean;
}

export type FormConfig = Dict<FieldModel>;
