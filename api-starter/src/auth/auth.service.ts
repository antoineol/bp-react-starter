import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express-serve-static-core';
import * as moment from 'moment';
import { appConfig } from '../common/app.config';
import { env } from '../environment/env';

export interface JwtData {
  email: string;
  name: string;
  locale: string;
  domain: string;
  subject: string;
  roles: string[];
  picture: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private logger: Logger) {
  }

  createJwt({ email, name, locale, domain, subject, roles, picture }: JwtData): string {
    // This method extracts profile info and include them in JWT
    const refresh = moment().add(appConfig.jwtRefreshTime, 's').toISOString();
    const fields = {
      email, name, locale, domain, refresh, picture,
      [appConfig.jwtClaimRoles]: roles,
      [appConfig.jwtClaimDefaultRole]: roles[0],
      [appConfig.jwtClaimUserId]: subject,
    };
    const payload = appConfig.jwtNamespace ? { [appConfig.jwtNamespace]: fields } : fields;
    return this.jwtService.sign(payload, {
      subject,
      audience: appConfig.jwtAudience, //  role / scope for validation if useful
      noTimestamp: env.isDev,
    });
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
    const options: CookieOptions = appConfig.cookieConfig;
    return [
      // Public part (accessible from browser JavaScript)
      {
        name: appConfig.jwtPayloadCookieName,
        value: jwtHeaderAndPayload,
        options: { ...options, httpOnly: false },
      },
      // Private part (HTTP-only cookie)
      { name: appConfig.jwtSignatureCookieName, value: jwtSignature, options },
    ];
  }

  splitJwt(jwt: string): { jwtHeaderAndPayload: string, jwtSignature: string } {
    const i = jwt.lastIndexOf('.');
    const jwtHeaderAndPayload = jwt.substr(0, i);
    const jwtSignature = jwt.substr(i + 1);
    return { jwtHeaderAndPayload, jwtSignature };
  }
}
