import { JWT } from 'google-auth-library';
import { admin_directory_v1, google } from 'googleapis';
import { appConfig } from '../common/app.config';
import { env } from '../environment/env';

const admin = google.admin('directory_v1');
const readUserGroupsScope = 'https://www.googleapis.com/auth/admin.directory.group.readonly';

let authClient: JWT;

async function getGoogleAuthClient(): Promise<JWT> {
  if (!authClient) {
    const auth = new google.auth.GoogleAuth({
      projectId: env.googleAdminProjectId,
      clientOptions: {
        subject: appConfig.impersonatedAdmin,
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

export async function fetchGoogleGroup(groupEmail: string): Promise<admin_directory_v1.Schema$Members> {
  const auth = await getGoogleAuthClient();
  const params = { groupKey: groupEmail, includeDerivedMembership: true, auth };
  return (await admin.members.list(params)).data;
}
