import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { ReqUser } from '../common/app.model';
import { env } from '../environment/env';
import { AuthService } from './auth.service';

interface GoogleJwt {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  hd: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // Some of the options are specified in src/auth/auth.module.ts
      passReqToCallback: false, // If true, add req as first parameter of validate()
      clientID: env.googleClientID,
      clientSecret: env.googleClientSecret,
      callbackURL: `${env.publicUrl}/auth/google/callback`,
      scope: ['openid', 'email', 'profile'],
      state: true,
    } as StrategyOptions);
  }

  async validate(googleAccessToken: string, noRefreshToken: string, profile: Profile): Promise<ReqUser> {
    const { email, name, locale, hd }: GoogleJwt = profile._json;
    const roles = await this.authService.validateGoogleUser(email, hd);
    // The Google access token should remain private since it gives access
    // to sensitive admin APIs like Directory API.
    const subject = profile.id;
    const jwt = this.authService.createJwt({ email, name, locale, hd, subject, roles });
    return { jwt, profile };
  }
}
