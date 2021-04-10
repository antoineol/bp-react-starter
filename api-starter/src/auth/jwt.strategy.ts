import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { env } from '../environment/env';

const logger = new Logger('jwt.strategy.ts');

if (
  !env.auth0Domain ||
  !env.auth0Audience ||
  env.auth0Audience === 'YOUR_API_IDENTIFIER'
) {
  logger.error(
    'Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values',
  );
  process.exit();
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${env.auth0Domain}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: env.auth0Audience,
      issuer: `https://${env.auth0Domain}/`,
      algorithms: ['RS256'],
    } as StrategyOptions);
  }

  validate(payload: unknown): unknown {
    // token revocation can be checked here.
    return payload;
  }
}
