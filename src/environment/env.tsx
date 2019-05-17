const processEnv = process.env;

export const env = {
  production: processEnv.REACT_APP_PROD && processEnv.REACT_APP_PROD.toLowerCase() !== 'false',
  apiPath: processEnv.REACT_APP_API_PATH,
  stagingVar: processEnv.REACT_APP_STAGING_VAR,
  isJest: processEnv.JEST_WORKER_ID !== undefined,
};

if (!env.isJest) { // If not jest
  console.log('Environment:', env);
}
