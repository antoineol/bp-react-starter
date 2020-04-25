import { JwtClaims } from '../../features/auth/auth.model';
import { RecursivePartial } from '../models/app.models';

export const defaultCache: RecursivePartial<AppCache> = {
  home: { count: 1 },
};

export interface AppCache {
  jwt?: string;
  home: {
    count: number;
  };
  profile?: JwtClaims;
  features: Features;
}

export interface Features {
  queryJsonPlaceholder?: boolean;
}
