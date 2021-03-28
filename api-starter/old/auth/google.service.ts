import { ForbiddenException, Injectable } from '@nestjs/common';
import { JWT, OAuth2Client } from 'google-auth-library';
import { admin_directory_v1, google } from 'googleapis';
import { appConfig } from '../common/app.config';
import { env } from '../environment/env';

const client = new OAuth2Client(env.googleClientID);

@Injectable()
export class GoogleService {

  async validateGoogleToken(token: string) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.googleClientID,
    });
    const payload = ticket.getPayload() as ReturnType<typeof ticket.getPayload> & { locale: string };
    const { hd: domain, email, name, sub: subject, locale, picture } = payload;
    const roles = await this.validateUserGroups(email, domain);
    return { email, name, locale, domain, picture, subject, roles };
  }

  private async validateUserGroups(email: string, domain: string): Promise<string[]> {
    if (appConfig.authorizedDomain && appConfig.authorizedDomain !== domain) {
      throw new ForbiddenException();
    }
    if (!appConfig.authorizedGoogleGroups || !appConfig.authorizedGoogleGroups.length) {
      return [];
    }
    // Check that the user belongs to the groups whitelist
    const groups = await Promise.all(appConfig.authorizedGoogleGroups
      .map(email => this.fetchGoogleGroup(email).then(group => ({ email, group }))));
    // List the groups the user belongs to; they will be used as roles.
    const userGroups = groups.filter(g => g.group.members.find(member => member.email === email));
    if (!userGroups || !userGroups.length) {
      throw new ForbiddenException();
    }
    return userGroups.map(group => group.email);
  }

  private async fetchGoogleGroup(groupEmail: string): Promise<admin_directory_v1.Schema$Members> {
    const auth = await getGoogleAuthClient();
    const params = { groupKey: groupEmail, includeDerivedMembership: true, auth };
    return (await admin.members.list(params)).data;
  }
}

const admin = google.admin('directory_v1');
const readUserGroupsScope = 'https://www.googleapis.com/auth/admin.directory.group.readonly';

let authClient: JWT;

async function getGoogleAuthClient(): Promise<JWT> {
  if (!authClient) {
    const auth = new google.auth.GoogleAuth({
      projectId: env.googleAdminProjectId,
      clientOptions: {
        subject: env.impersonatedAdmin,
      },
      credentials: {
        client_email: env.googleAdminClientEmail,
        private_key: env.googleAdminPrivateKey,
      },
      scopes: [readUserGroupsScope],
    });
    authClient = await auth.getClient() as JWT;
  }
  return authClient;
}
