// Google response object

export interface GoogleAuthResponse {
  // Also contains Ca, uc, Qt that seem to be minified versions of below fields.
  googleId: string;
  tokenObj: {
    token_type: 'Bearer';
    access_token: string;
    scope: string;
    login_hint: string;
    expires_in: number;
    id_token: string;
    session_state?: { extraQueryParams?: { authuser?: string } };
    first_issued_at: number;
    expires_at: number;
    idpId: 'google';
  };
  tokenId: string;
  accessToken: string;
  profileObj: {
    googleId: string;
    imageUrl: string;
    email: string;
    name: string; // full name
    givenName: string; // first name
    familyName: string;
  };
}

// API JWT objet

export enum JwtFields {
  jwtNamespace = 'https://hasura.io/jwt/claims',
  jwtClaimRoles = 'x-hasura-allowed-roles',
  jwtClaimDefaultRole = 'x-hasura-default-role',
  jwtClaimUserId = 'x-hasura-user-id',
}

export interface TokenDto {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  [JwtFields.jwtNamespace]: JwtClaims;
}

export interface JwtClaims {
  email: string;
  name: string;
  locale: string;
  hd: string;
  refresh: string;
  picture: string;
  [JwtFields.jwtClaimRoles]: string;
  [JwtFields.jwtClaimDefaultRole]: string;
  [JwtFields.jwtClaimUserId]: string;
}
