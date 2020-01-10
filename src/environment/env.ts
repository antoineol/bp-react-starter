const processEnv = process.env;

const envLabel = processEnv.REACT_APP_ENV && processEnv.REACT_APP_ENV.toLowerCase();
const isDev = envLabel === 'dev' || envLabel === 'development';
const isStaging = envLabel === 'staging';
const isProd = envLabel === 'prod' || envLabel === 'production';
if (!isDev && !isStaging && !isProd) {
  throw new Error(`Invalid environment found: ${processEnv.REACT_APP_ENV}`);
}

// Add here non-confidential environment-based configurations (e.g. domains, base URLs)
const dev = {};
const staging = {};
const prod = {};

const nonConfidentialEnv = isDev ? dev : isStaging ? staging : prod;

export const env = {
  ...nonConfidentialEnv,
  isDev,
  isStaging,
  isProd,
  apiPath: processEnv.REACT_APP_API_PATH,
  publicOrigin: processEnv.REACT_APP_PUBLIC_ORIGIN,
  isNodeProduction: processEnv.NODE_ENV === 'production',
  isJest: processEnv.JEST_WORKER_ID !== undefined,
};

if (!env.isJest) { // If not jest
  console.log('Environment:', env);
}
