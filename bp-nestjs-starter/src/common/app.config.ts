//                  1 m  15 m
const jwtLifeTime = 60 * 15; // seconds

export enum JwtFields {
  jwtNamespace = 'https://hasura.io/jwt/claims',
  jwtClaimRoles = 'x-hasura-allowed-roles',
  jwtClaimDefaultRole = 'x-hasura-default-role',
  jwtClaimUserId = 'x-hasura-user-id',
}

export const appConfig = {
  localhostLatency: 400, // ms
  authorizedDomain: 'earlymetrics.com',
  impersonatedAdmin: 'antoine_ol@earlymetrics.com',
  authorizedGoogleGroups: ['team@earlymetrics.com', 'analysts@earlymetrics.com', 'editor@earlymetrics.com'],
  authEndMessage: 'signInFinished',
  jwtLifeTime,
  jwtRefreshTime: jwtLifeTime / 2,
  jwtPayloadCookieName: 'jwtHeaderPayload',
  jwtSignatureCookieName: 'jwtSignature',
  jwtSignatureCookieHttpOnly: false, // Should be true as soon as Hasura supports JWT in cookies
  jwtIssuer: 'em-starter-app',
  jwtAlgorithm: 'HS256',
  jwtAudience: 'em-everybody',
  jwtNamespace: JwtFields.jwtNamespace,
  jwtClaimRoles: JwtFields.jwtClaimRoles,
  jwtClaimDefaultRole: JwtFields.jwtClaimDefaultRole,
  jwtClaimUserId: JwtFields.jwtClaimUserId,
  securityRequestedByHeader: 'starter-app',
};
