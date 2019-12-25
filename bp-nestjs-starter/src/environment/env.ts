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
};
const staging = {
  publicOrigin: 'http://localhost:3000',
  publicUrl: 'http://localhost:3000/api',
};
const prod = {
  publicOrigin: 'http://localhost:3000',
  publicUrl: 'http://localhost:3000/api',
};

const nonConfidentialEnv = isDev ? dev : isStaging ? staging : prod;

export const env = {
  ...nonConfidentialEnv,
  isDev,
  isStaging,
  isProd,
  isJest: process.env.JEST_WORKER_ID !== undefined,
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  allowedHosts: process.env.ALLOWED_HOST,
  airTableApiKey: process.env.AIRTABLE_API_KEY,
  secretKey: process.env.SECRET_KEY,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};
