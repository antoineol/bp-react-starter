import { config } from './dotenv/dotenv';

config({
  path: `${__dirname}/../../.env`,
  allowEmptyValues: [
    'ALLOWED_HOST',
  ],
});

export const env = {
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 4000,
  allowedHosts: process.env.ALLOWED_HOST,
  airTableApiKey: process.env.AIRTABLE_API_KEY,
  secretKey: process.env.SECRET_KEY,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};
