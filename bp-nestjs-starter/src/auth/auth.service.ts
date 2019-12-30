import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CookieOptions } from 'express-serve-static-core';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { appConfig } from '../common/app.config';
import { flat, httpGet } from '../common/app.utils';
import { env } from '../environment/env';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
  }

  createJwt({ email, name, locale, hd, subject }: any): string {
    // This method extracts profile info and include them in JWT
    const refresh = moment().add(appConfig.jwtRefreshTime, 's').toISOString();
    return this.jwtService.sign({ email, name, locale, hd, refresh }, {
      subject,
      // audience: role / scope for validation if useful
    });
  }

  async validateGoogleUser(accessToken: string, email: string): Promise<void> {
    // Check that the user belongs to the groups whitelist
    const groups: GoogleGroup[] = await Promise.all(appConfig.authorizedGoogleGroups
      .map(groupEmail => fetchGoogleGroup(groupEmail, accessToken)));
    const members = flat(groups.map(group => group.members));
    if (!members.find((member) => member.email === email)) {
      throw new ForbiddenException();
    }
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
      maxAge: appConfig.jwtLifeTime * 1000,
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

interface GoogleGroupMember {
  kind: string;
  etag: string;
  id: string;
  email: string;
  role: 'MEMBER' | 'OWNER';
  type: 'USER' | 'GROUP';
  status: 'ACTIVE' | 'SUSPENDED';
}

interface GoogleGroup {
  kind: string;
  etag: string;
  members: GoogleGroupMember[];
}

function fetchGoogleGroup(email: string, accessToken: string): Promise<GoogleGroup> {
  const url = `https://www.googleapis.com/admin/directory/v1/groups/${encodeURIComponent(email)}/members`;
  return httpGet(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { includeDerivedMembership: true },
  });
}
