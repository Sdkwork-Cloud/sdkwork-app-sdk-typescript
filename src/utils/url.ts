export interface UrlParts {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

export function parseUrl(url: string): UrlParts {
  const parsed = new URL(url);
  return {
    protocol: parsed.protocol,
    host: parsed.host,
    hostname: parsed.hostname,
    port: parsed.port,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    origin: parsed.origin,
  };
}

export function buildUrl(parts: Partial<UrlParts> & { baseUrl?: string }): string {
  const base = parts.baseUrl ? new URL(parts.baseUrl) : new URL('http://localhost');

  if (parts.protocol) base.protocol = parts.protocol;
  if (parts.host) base.host = parts.host;
  if (parts.hostname) base.hostname = parts.hostname;
  if (parts.port) base.port = parts.port;
  if (parts.pathname) base.pathname = parts.pathname;
  if (parts.search) base.search = parts.search;
  if (parts.hash) base.hash = parts.hash;

  return base.toString();
}

export function parseQueryString(queryString: string): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  const searchParams = new URLSearchParams(queryString.replace(/^\?/, ''));

  searchParams.forEach((value, key) => {
    const existing = params[key];
    if (existing === undefined) {
      params[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      params[key] = [existing, value];
    }
  });

  return params;
}

export function buildQueryString(
  params: Record<string, string | number | boolean | null | undefined | string[] | number[] | boolean[]>,
  options?: { arrayFormat?: 'bracket' | 'comma' | 'repeat' | 'indices'; skipNull?: boolean; skipUndefined?: boolean }
): string {
  const { arrayFormat = 'repeat', skipNull = true, skipUndefined = true } = options ?? {};
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (skipNull && value === null) return;
    if (skipUndefined && value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemValue = String(item);
        switch (arrayFormat) {
          case 'bracket':
            searchParams.append(`${key}[]`, itemValue);
            break;
          case 'comma':
            if (index === 0) {
              searchParams.set(key, value.map(String).join(','));
            }
            break;
          case 'indices':
            searchParams.append(`${key}[${index}]`, itemValue);
            break;
          case 'repeat':
          default:
            searchParams.append(key, itemValue);
            break;
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export function appendQueryString(url: string, params: Record<string, unknown>): string {
  const queryString = buildQueryString(params as Record<string, string>);
  if (!queryString) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${queryString}`;
}

export function removeQueryString(url: string): string {
  const questionIndex = url.indexOf('?');
  if (questionIndex === -1) return url;
  return url.substring(0, questionIndex);
}

export function getQueryParam(url: string, param: string): string | null {
  const parsed = new URL(url, 'http://localhost');
  return parsed.searchParams.get(param);
}

export function setQueryParam(url: string, param: string, value: string): string {
  const parsed = new URL(url, 'http://localhost');
  parsed.searchParams.set(param, value);
  return parsed.toString();
}

export function removeQueryParam(url: string, param: string): string {
  const parsed = new URL(url, 'http://localhost');
  parsed.searchParams.delete(param);
  return parsed.toString();
}

export function hasQueryParam(url: string, param: string): boolean {
  const parsed = new URL(url, 'http://localhost');
  return parsed.searchParams.has(param);
}

export function isAbsoluteUrl(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/.test(url);
}

export function isRelativeUrl(url: string): boolean {
  return !isAbsoluteUrl(url);
}

export function joinUrl(...parts: string[]): string {
  return parts
    .map((part, index) => {
      if (index === 0) {
        return part.replace(/\/+$/, '');
      }
      if (index === parts.length - 1) {
        return part.replace(/^\/+/, '');
      }
      return part.replace(/^\/+/, '').replace(/\/+$/, '');
    })
    .join('/');
}

export function resolveUrl(base: string, relative: string): string {
  return new URL(relative, base).toString();
}

export function normalizeUrl(url: string): string {
  const parsed = new URL(url, 'http://localhost');

  parsed.pathname = parsed.pathname.replace(/\/+/g, '/');

  parsed.pathname = parsed.pathname.replace(/\/$/, '');

  const sortedParams = new URLSearchParams();
  const keys = Array.from(parsed.searchParams.keys()).sort();
  keys.forEach((key) => {
    const values = parsed.searchParams.getAll(key);
    values.forEach((value) => sortedParams.append(key, value));
  });
  parsed.search = sortedParams.toString();

  return parsed.toString();
}

export function extractDomain(url: string): string {
  const parsed = new URL(url, 'http://localhost');
  return parsed.hostname;
}

export function extractSubdomain(url: string): string | null {
  const hostname = extractDomain(url);
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts.slice(0, -2).join('.');
  }
  return null;
}

export function extractTld(url: string): string {
  const hostname = extractDomain(url);
  const parts = hostname.split('.');
  const lastPart = parts.length > 1 ? parts[parts.length - 1] : '';
  return lastPart ?? '';
}
