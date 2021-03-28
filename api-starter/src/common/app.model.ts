import { JwtFields } from './app.config';

export interface ReqUser {
  jwt: string;
}

export interface JwtClaims {
  [JwtFields.jwtClaimRoles]: string[];
  [JwtFields.jwtClaimDefaultRole]: string;
  [JwtFields.jwtClaimUserId]: string;
}
