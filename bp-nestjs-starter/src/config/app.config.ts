//                  1 m  15 m
const jwtLifeTime = 60 * 15;
export const appConfig = {
  jwtLifeTime,
  jwtPayloadCookieName: 'jwtHeaderPayload',
  jwtSignatureCookieName: 'jwtSignature',
  jwtIssuer: 'Early Metrics',
  jwtAlgorithm: 'HS256',
};
