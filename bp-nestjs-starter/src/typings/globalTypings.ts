// tslint:disable-next-line:no-namespace
declare namespace Express {
  interface User {
    iat: number;
    exp: number;
    iss: string;
    sub: string;
    // Importing the enum breaks User type in usages
    'https://hasura.io/jwt/claims': {
      email: string;
      name: string;
      locale: string;
      hd: string;
      refresh: string;
      'x-hasura-allowed-roles': string[];
      'x-hasura-default-role': string;
      'x-hasura-user-id': string;
    };
  }
}
