//                  1 m  15 m
const jwtLifeTime = 60 * 15; // seconds
export const appConfig = {
  localhostLatency: 400, // ms
  authorizedDomain: 'earlymetrics.com',
  impersonatedAdmin: 'antoine_ol@earlymetrics.com',
  authorizedGoogleGroups: ['team@earlymetrics.com'],
  authEndMessage: 'signInFinished',
  jwtLifeTime,
  jwtRefreshTime: jwtLifeTime / 2,
  jwtPayloadCookieName: 'jwtHeaderPayload',
  jwtSignatureCookieName: 'jwtSignature',
  jwtIssuer: 'Early Metrics',
  jwtAlgorithm: 'HS256',
  securityRequestedByHeader: 'starter-app',
};
