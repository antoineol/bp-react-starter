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
  apiWs: processEnv.REACT_APP_API_WS as string,
  hasuraPath: processEnv.REACT_APP_HASURA_PATH,
  hasuraWs: processEnv.REACT_APP_HASURA_WS as string,
  publicOrigin: processEnv.REACT_APP_PUBLIC_ORIGIN,
  isNodeProduction: processEnv.NODE_ENV === 'production',
  isJest: processEnv.JEST_WORKER_ID !== undefined,
};

if (!env.isJest) { // If not jest
  console.log('Environment:', env);
}
