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
