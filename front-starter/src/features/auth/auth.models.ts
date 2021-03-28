export interface Auth0User {
  email: string;
  email_verified: boolean;
  family_name?: string; // provided by Google, not Auth0 user/pwd
  given_name?: string; // provided by Google, not Auth0 user/pwd
  locale?: string; // e.g. 'fr' - provided by Google, not Auth0 user/pwd
  name: string;
  nickname: string;
  picture: string; // url
  sub: string; // user ID
  updated_at: string; // ISO Date, e.g. "2021-03-28T08:44:15.081Z"
}
