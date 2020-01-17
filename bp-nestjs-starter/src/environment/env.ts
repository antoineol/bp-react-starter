import { config } from './dotenv/dotenv';

config({
  path: `${__dirname}/../../.env`,
  allowEmptyValues: [
    'ALLOWED_HOST',
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
  publicOrigin: 'http://localhost:3000',
  publicUrl: 'http://localhost:3000/api',
  googleAdminProjectId: 'rating-rocket',
  googleAdminClientEmail: 'check-group-members@rating-rocket.iam.gserviceaccount.com',
};
const staging = {
  publicOrigin: 'http://localhost:3000',
  publicUrl: 'http://localhost:3000/api',
  googleAdminProjectId: 'rating-rocket',
  googleAdminClientEmail: 'check-group-members@rating-rocket.iam.gserviceaccount.com',
};
const prod = {
  publicOrigin: 'http://localhost:3000',
  publicUrl: 'http://localhost:3000/api',
  googleAdminProjectId: 'rating-rocket',
  googleAdminClientEmail: 'check-group-members@rating-rocket.iam.gserviceaccount.com',
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
  allowedHosts: process.env.ALLOWED_HOST,
  typeOrmUrl: process.env.TYPEORM_URL,
  typeOrmTestUrl: process.env.TYPEORM_TEST_URL,
  secretKey: process.env.SECRET_KEY,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleAdminPrivateKey: process.env.GOOGLE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
