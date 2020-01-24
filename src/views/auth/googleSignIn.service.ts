import jwtDecode from 'jwt-decode';
import { appConfig } from '../../common/app.config';
import { handleError } from '../../common/services/error.service';
import { getCookie } from '../../common/utils/app.utils';
import { apiPost } from '../../common/utils/http.utils';
import { env } from '../../environment/env';
import { showSignIn } from './auth.service';

enum JwtFields {
  jwtNamespace = 'https://hasura.io/jwt/claims',
  jwtClaimRoles = 'x-hasura-allowed-roles',
  jwtClaimDefaultRole = 'x-hasura-default-role',
  jwtClaimUserId = 'x-hasura-user-id',
}

let refreshTimer: NodeJS.Timeout | null = null;
let prevRefreshTime: number;

export async function signInWithGoogle(): Promise<string> {
  const jwt = await gSignInPopup();
  scheduleJwtRefresh(jwt);
  return jwt;
}

export function scheduleJwtRefresh(jwt: string | null, allowCallTwice = false) {
  // If handling error is simpler, we could make it return a promise rejected if any error
  // interrupting the process happens, instead of handling error here.
  if (!jwt) {
    return;
  }
  const decoded: TokenDto = jwtDecode(jwt);
  const claims = (JwtFields.jwtNamespace ? decoded[JwtFields.jwtNamespace] : decoded) as JwtClaims;
  if (!claims.refresh) {
    throw new Error(`No refresh date found`);
  }
  const date = new Date(claims.refresh);
  const time = date.getTime();
  if (!allowCallTwice && time === prevRefreshTime) {
    throw new Error(`Refresh time was not updated. Old: ${new Date(
      prevRefreshTime).toISOString()}, new: ${date.toISOString()}`);
  }
  prevRefreshTime = time;
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  let renewInMs = time - new Date().getTime();
  if (renewInMs < 0) {
    renewInMs = 0;
  }
  refreshTimer = setTimeout(refreshJwt, renewInMs);
}

// Implementation details

type MessageEventHandler = (event: MessageEvent) => void;

let popup: Window | null = null;
let signInMsgHandler: MessageEventHandler | null = null;
let timer: NodeJS.Timeout | null = null;
const checkPopupFrequency = 1000; // ms

interface TokenDto {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  [JwtFields.jwtNamespace]: JwtClaims;
}

interface JwtClaims {
  email: string;
  name: string;
  locale: string;
  hd: string;
  refresh: string;
  [JwtFields.jwtClaimRoles]: string;
  [JwtFields.jwtClaimDefaultRole]: string;
  [JwtFields.jwtClaimUserId]: string;
}

function gSignInPopup(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (popup && popup.closed) {
        popup = null;
      }
      if (popup) {
        throw new Error(
          'Trying to sign in, but the window is already detected. The sign in should' +
          ' remain blocked until the previous attempt is successful or canceled.');
      }
      signInMsgHandler = (event: MessageEvent) => {
        try {
          if (popup && event.origin === env.publicOrigin
            && event.data === appConfig.authEndMessage
            && event.source === popup) {
            const jwt = signInSuccess();
            resolve(jwt);
          }
        } catch (e) {
          reject(e);
        }
      };
      window.addEventListener('message', signInMsgHandler as MessageEventHandler, false);
      timer = setTimeout(() => checkPopupClosedBeforeSuccess(reject), checkPopupFrequency);
      popup = window.open(`${env.apiPath}/auth/google/signin`, 'signIn',
        'width=600,height=800');
    } catch (e) {
      reject(e);
    }
  });
}

async function refreshJwt() {
  try {
    await apiPost('/auth/refresh');
    const jwt = getCookie(appConfig.jwtCookieName);
    scheduleJwtRefresh(jwt);
  } catch (e) {
    handleError(e);
    showSignIn().catch(handleError);
  }
}

function stopSignIn() {
  window.removeEventListener('message', signInMsgHandler as MessageEventHandler, false);
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (popup) {
    popup?.close();
    popup = null;
  }
}

function signInSuccess(): string {
  const jwt = getCookie(appConfig.jwtCookieName);
  if (!jwt) {
    throw new Error(
      `Cookie ${appConfig.jwtCookieName} is expected after sign in, but was not found.`);
  }
  stopSignIn();
  return jwt;
}

function checkPopupClosedBeforeSuccess(reject: (reason: any) => void) {
  try {
    if (!popup || popup.closed) {
      stopSignIn();
      throw new Error('CANCELED');
    } else {
      timer = setTimeout(() => checkPopupClosedBeforeSuccess(reject), checkPopupFrequency);
    }
  } catch (e) {
    reject(e);
  }
}
