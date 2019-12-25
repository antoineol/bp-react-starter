// tslint:disable-next-line:no-namespace
declare namespace Express {
  // tslint:disable-next-line:no-empty-interface
  interface User {
    email: string;
    name: string;
    locale: string;
    hd: string;
    refresh: string;
    iat: number;
    exp: number;
    iss: string;
    sub: string;
  }
}
