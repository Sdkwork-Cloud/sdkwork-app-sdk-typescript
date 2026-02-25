export const APP_API_PREFIX = '/app/v3/api';
/** @deprecated Use APP_API_PREFIX instead. */
export const CORE_API_PREFIX = APP_API_PREFIX;

function normalizePath(path: string): string {
  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

/** @deprecated Use appApiPath instead. */
export function coreApiPath(path: string): string {
  return `${CORE_API_PREFIX}${normalizePath(path)}`;
}

export function appApiPath(path: string): string {
  return `${APP_API_PREFIX}${normalizePath(path)}`;
}

export const API_PATHS = {
  auth: {
    base: appApiPath('/auth'),
    login: appApiPath('/auth/login'),
    register: appApiPath('/auth/register'),
    logout: appApiPath('/auth/logout'),
    refresh: appApiPath('/auth/refresh'),
    smsSend: appApiPath('/auth/sms/send'),
    smsVerify: appApiPath('/auth/sms/verify'),
    passwordReset: appApiPath('/auth/password/reset'),
    qrGenerate: appApiPath('/auth/qr/generate'),
    qrStatus: (qrKey: string) => appApiPath(`/auth/qr/status/${qrKey}`),
    qrConfirm: appApiPath('/auth/qr/confirm'),
    phoneLogin: appApiPath('/auth/phone/login'),
    oauthUrl: appApiPath('/auth/oauth/url'),
    oauthLogin: appApiPath('/auth/oauth/login'),
  },
  user: {
    base: appApiPath('/user'),
    profile: appApiPath('/user/profile'),
  },
} as const;
