import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CookieOptions } from 'express-serve-static-core';
import { Profile } from 'passport-google-oauth20';
import { Repository } from 'typeorm';
import { appConfig } from '../config/app.config';
import { env } from '../environment/env';
import { User } from '../user/user.entity';

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
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
  }

  createJwt(profile: Profile): string {
    // This method extracts profile info and include them in JWT
    const { email, name, locale, hd }: GoogleJwt = profile._json;
    return this.jwtService.sign({ email, name, locale, hd }, {
      subject: profile.id,
      // audience: role / scope for validation if useful
    });
  }

  async validateGoogleUser(accessToken: string): Promise<void> {
    // Check that the user belongs to the groups whitelist
  }

  makeJwtCookies(jwt: string): Array<{ name: string, value: string, options: CookieOptions }> {
    // Here, the JWT is split between a public and a private part, so that:
    // - the JWT payload is readable from the client, for instance to know that the user is logged
    //   in (keep the benefit we had in using local storage), for client-side redirection to the
    //   right pages (UX concern)
    // - the JWT signature is not accessible from JavaScript, which guards against a few security
    //   flaws, e.g. one cannot get the full JWT from JavaScript (if signature is missing, the
    //   server rejects the request)
    const { jwtHeaderAndPayload, jwtSignature } = this.splitJwt(jwt);
    const options = {
      secure: env.isProduction,
      sameSite: true,
      maxAge: appConfig.jwtLifeTime,
    };
    return [
      // Public part (accessible from browser JavaScript)
      { name: appConfig.jwtPayloadCookieName, value: jwtHeaderAndPayload, options },
      // Private part (HTTP-only cookie)
      { name: appConfig.jwtSignatureCookieName, value: jwtSignature, options: { ...options, httpOnly: true } },
    ];
  }

  splitJwt(jwt: string): { jwtHeaderAndPayload: string, jwtSignature: string } {
    const i = jwt.lastIndexOf('.');
    const jwtHeaderAndPayload = jwt.substr(0, i);
    const jwtSignature = jwt.substr(i + 1);
    return { jwtHeaderAndPayload, jwtSignature };
  }
}
