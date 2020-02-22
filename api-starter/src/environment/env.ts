import { config } from './dotenv/dotenv';

config({
  path: `${__dirname}/../../.env`,
  allowEmptyValues: [
    'ALLOWED_HOST',
    'GOOGLE_ADMIN_PRIVATE_KEY',
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
  publicOrigin: 'http://localhost:4141',
  publicUrl: 'http://localhost:4141',
  googleAdminProjectId: '',
  impersonatedAdmin: '', // GSuite admin email
  googleAdminClientEmail: '', // service account impersonating above admin
  allowedHosts: 'http://localhost:3000,http://localhost:5000',
};
const staging = {
  publicOrigin: 'https://staging-aol-starter-api.herokuapp.com',
  publicUrl: 'https://staging-aol-starter-api.herokuapp.com',
  googleAdminProjectId: '',
  impersonatedAdmin: '', // GSuite admin email
  googleAdminClientEmail: '', // service account impersonating above admin
  allowedHosts: 'https://master--aol-starter.netlify.com',
};
const prod = {
  publicOrigin: 'http://localhost:3000',
  publicUrl: 'http://localhost:3000/api',
  googleAdminProjectId: '',
  impersonatedAdmin: '', // GSuite admin email
  googleAdminClientEmail: '', // service account impersonating above admin
  allowedHosts: 'https://aol-starter.netlify.com',
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
  port: process.env.PORT || 4141,
  typeOrmUrl: process.env.TYPEORM_URL,
  typeOrmTestUrl: process.env.TYPEORM_TEST_URL,
  secretKey: process.env.SECRET_KEY,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleAdminPrivateKey: process.env.GOOGLE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
