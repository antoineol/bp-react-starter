export const env = {
  production: process.env.REACT_APP_PROD && process.env.REACT_APP_PROD.toLowerCase() !== 'false',
  apiPath: process.env.REACT_APP_API_PATH,
  stagingVar: process.env.REACT_APP_STAGING_VAR,
};

console.log('Environment:', env);
