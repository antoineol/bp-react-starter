import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { env } from '../environment/env';
import { AuthService } from './auth.service';

const readUserGroupsScope = 'https://www.googleapis.com/auth/admin.directory.group.readonly';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: false, // If true, add req as first parameter of validate()
      clientID: env.googleClientID,
      clientSecret: env.googleClientSecret,
      callbackURL: 'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile', readUserGroupsScope],
      // state: true,
    } as StrategyOptions);
  }

  async validate(googleAccessToken: string, noRefreshToken: string, profile: Profile) {
    await this.authService.validateGoogleUser(googleAccessToken);
    // The Google access token should remain private since it gives access
    // to sensitive admin APIs like Directory API.
    const accessToken = this.authService.createJwt(profile);
    return { accessToken, profile };
  }
}
