import { Profile } from 'passport-google-oauth20';
import { JwtFields } from './app.config';

export interface ReqUser {
  jwt: string;
  profile: Profile;
}

export interface JwtClaims {
  [JwtFields.jwtClaimRoles]: string[];
  [JwtFields.jwtClaimDefaultRole]: string;
  [JwtFields.jwtClaimUserId]: string;
}
