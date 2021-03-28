import { CookieOptions } from 'express';
import { env } from '../environment/env';

//                  1 m  15 m
const jwtLifeTime = 60 * 15; // seconds
const allowCorsApi = false;
// Should be true as soon as Hasura supports JWT in cookies
const jwtSignatureCookieHttpOnly = false;

export enum JwtFields {
  jwtNamespace = 'https://hasura.io/jwt/claims',
  jwtClaimRoles = 'x-hasura-allowed-roles',
  jwtClaimDefaultRole = 'x-hasura-default-role',
  jwtClaimUserId = 'x-hasura-user-id',
}

export const appConfig = {
  localhostLatency: 400, // ms
  authorizedDomain: '',
  // For GSuite to authorize only users in below groups (provide emails). Those group emails
  // will be included in JWT as roles
  authorizedGoogleGroups: [],
  frontFolder: 'front-starter',
  jwtNamespace: JwtFields.jwtNamespace,
  jwtClaimRoles: JwtFields.jwtClaimRoles,
  jwtClaimDefaultRole: JwtFields.jwtClaimDefaultRole,
  jwtClaimUserId: JwtFields.jwtClaimUserId,
  jwtAnonymousRole: 'anonymous',
  securityRequestedByHeader: 'aol-starter-app',
  allowCorsApi,
  cookieConfig: {
    secure: !env.isDev,
    maxAge: jwtLifeTime * 1000,
    sameSite: allowCorsApi ? 'none' : 'strict',
    httpOnly: jwtSignatureCookieHttpOnly,
  } as CookieOptions,
};
