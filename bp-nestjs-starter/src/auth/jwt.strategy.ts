import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, StrategyOptions } from 'passport-jwt';
import { appConfig } from '../config/app.config';
import { env } from '../environment/env';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      // May be replaced with PEM to be safer in production
      secretOrKey: env.secretKey,
      issuer: appConfig.jwtIssuer,
      algorithms: [appConfig.jwtAlgorithm],
      // passReqToCallback // To add req as first param in validate()
    } as StrategyOptions);
  }

  async validate(payload: JwtPayload) {
    // token revocation can be checked here.
    return payload;
  }
}

function cookieExtractor(req: Request): string | null {
  return req.cookies.jwtSignature ?
    `${req.cookies.jwtHeaderPayload}.${req.cookies.jwtSignature}` : null;
}
