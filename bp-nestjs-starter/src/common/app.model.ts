import { JwtFields } from './app.config';
import { Profile } from 'passport-google-oauth20';

export interface ReqUser {
  jwt: string;
  profile: Profile;
}

export interface JwtClaims {
  [JwtFields.jwtClaimRoles]: string;
  [JwtFields.jwtClaimDefaultRole]: string;
  [JwtFields.jwtClaimUserId]: string;
}
