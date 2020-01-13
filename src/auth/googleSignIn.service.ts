import jwtDecode from 'jwt-decode';
import { appConfig } from '../common/app.config';
import { apiPost, deleteCookie, getCookie } from '../common/app.utils';
import { handleError } from '../common/services/error.service';
import { env } from '../environment/env';
import { signIn } from './auth.service';

type MessageEventHandler = (event: MessageEvent) => void;

let popup: Window | null = null;
let signInMsgHandler: MessageEventHandler | null = null;
let timer: NodeJS.Timeout | null = null;
const checkPopupFrequency = 1000; // ms

export async function signInWithGoogle(): Promise<string> {
  const jwt = await gSignInPopup();
  scheduleJwtRefresh(jwt);
  return jwt;
}

interface TokenDto {
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

let refreshTimer: NodeJS.Timeout | null = null;
let prevRefreshTime: number;

export function scheduleJwtRefresh(jwt: string | undefined) {
  // If handling error is simpler, we could make it return a promise rejected if any error
  // interrupting the process happens, instead of handling error here.
  if (!jwt) {
    return;
  }
  const decoded: TokenDto = jwtDecode(jwt);
  const date = new Date(decoded.refresh);
  const time = date.getTime();
  if (time === prevRefreshTime) {
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

export function localSignOut() {
  deleteCookie(appConfig.jwtCookieName);
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
    signIn().catch(handleError);
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
