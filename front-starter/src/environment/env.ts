const processEnv = process.env;

const envLabel = processEnv.REACT_APP_ENV && processEnv.REACT_APP_ENV.toLowerCase();
const isDev = envLabel === 'dev' || envLabel === 'development';
const isStaging = envLabel === 'staging';
const isProd = envLabel === 'prod' || envLabel === 'production';
if (!isDev && !isStaging && !isProd) {
  throw new Error(`Invalid environment found: ${processEnv.REACT_APP_ENV}`);
}

// All environment variables (including non-confidential ones) are in .env files to avoid
// including in the bundle code related to other environments.

export const env = {
  isDev,
  isStaging,
  isProd,
  apiPath: processEnv.REACT_APP_API_PATH,
  hasuraPath: processEnv.REACT_APP_HASURA_PATH,
  hasuraWs: processEnv.REACT_APP_HASURA_WS as string,
  isNodeProduction: processEnv.NODE_ENV === 'production',
  isJest: processEnv.JEST_WORKER_ID !== undefined,
  useServiceWorker: toBoolean(processEnv.REACT_APP_USE_SERVICE_WORKER),
  // googleClientID: processEnv.REACT_APP_GOOGLE_CLIENT_ID as string,
  auth0Domain: processEnv.REACT_APP_AUTH0_DOMAIN as string,
  auth0ClientId: processEnv.REACT_APP_AUTH0_CLIENT_ID as string,
  auth0Audience: processEnv.REACT_APP_AUTH0_AUDIENCE as string,
};

const requiredFields: (keyof typeof env)[] = [
  'apiPath', 'hasuraPath', 'hasuraWs', 'auth0Domain', 'auth0ClientId', 'auth0Audience',
  // 'googleClientID',
];

if (!env.isJest) { // If not jest
  console.log('Environment:', env);
}

for (const f of requiredFields) {
  if (!env[f]) {
    throw new Error(`Missing required environment variable ${f}`);
  }
}

function toBoolean(value: string | undefined, defaultValue = false): boolean {
  return defaultValue
    ? !value || value.toLowerCase() !== 'false'
    : !!value && value.toLowerCase() === 'true';
}
