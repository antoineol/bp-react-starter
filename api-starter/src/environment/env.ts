import { dotEnvDir } from '../root';
import { config } from './dotenv/dotenv';

config({
  path: `${dotEnvDir}/.env`,
  allowEmptyValues: [
    'ALLOWED_HOST',
    // 'GOOGLE_ADMIN_PRIVATE_KEY',
  ],
});

const envLabel = process.env.APP_ENV && process.env.APP_ENV.toLowerCase();
const isDev = envLabel === 'dev' || envLabel === 'development';
const isStaging = envLabel === 'staging';
const isProd = envLabel === 'prod' || envLabel === 'production';
if (!isDev && !isStaging && !isProd) {
  throw new Error(`Invalid environment found: ${process.env.APP_ENV}`);
}

// Add here non-confidential environment-based configurations (e.g. domains, base URLs)
const dev = {
  publicOrigin: 'http://localhost:4149',
  publicUrl: 'http://localhost:4149',
  hasuraHttp: 'http://localhost:8089/v1',
  allowedHosts: 'http://localhost:3000,http://localhost:5000',
  auth0Domain: 'aol-perso.eu.auth0.com',
  auth0ClientId: 'Edy6xnrhvyDwuIsi3CWNBZSXd6JE7K0p',
  auth0Audience: 'react-starter',
  // googleAdminProjectId: '',
  // impersonatedAdmin: '', // GSuite admin email
  // googleAdminClientEmail: '', // service account impersonating above admin
};
const staging = {
  publicOrigin: 'https://staging-aol-starter-api.herokuapp.com',
  publicUrl: 'https://staging-aol-starter-api.herokuapp.com',
  allowedHosts: 'https://master--aol-starter.netlify.com',
  hasuraHttp: 'TODO',
  auth0Domain: 'TODO',
  auth0ClientId: 'TODO',
  auth0Audience: 'TODO',
  // googleAdminProjectId: '',
  // impersonatedAdmin: '', // GSuite admin email
  // googleAdminClientEmail: '', // service account impersonating above admin
};
const prod = {
  publicOrigin: 'http://my.api.com',
  publicUrl: 'http://my.api.com',
  allowedHosts: 'https://aol-starter.netlify.com',
  hasuraHttp: 'TODO',
  auth0Domain: 'TODO',
  auth0ClientId: 'TODO',
  auth0Audience: 'TODO',
  // googleAdminProjectId: '',
  // impersonatedAdmin: '', // GSuite admin email
  // googleAdminClientEmail: '', // service account impersonating above admin
};

const nonConfidentialEnv = isDev ? dev : isStaging ? staging : prod;

export const env = {
  ...nonConfidentialEnv,
  isDev,
  isStaging,
  isProd,
  isJest: process.env.JEST_WORKER_ID !== undefined,
  nodeEnv: process.env.NODE_ENV,
  isNodeProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4149,
  typeOrmUrl: process.env.TYPEORM_URL,
  typeOrmTestUrl: process.env.TYPEORM_TEST_URL,
  secretKey: process.env.SECRET_KEY,
  hasuraAdminSecret: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  // googleClientID: process.env.GOOGLE_CLIENT_ID,
  // googleAdminPrivateKey: process.env.GOOGLE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
