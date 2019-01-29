const envLocal = {
  apiPath: 'https://jsonplaceholder.typicode.com',
  production: false,
};
const envProd = {
  apiPath: 'https://jsonplaceholder.typicode.com',
  production: true,
};

function getEnv() {
  switch (process.env.REACT_APP_ENV) {
    case 'local':
      return envLocal;
    case undefined:
      return envProd;
    default:
      throw new Error(`Unsupported environment: ${process.env.REACT_APP_ENV}`);
  }
}

export const env = getEnv();
