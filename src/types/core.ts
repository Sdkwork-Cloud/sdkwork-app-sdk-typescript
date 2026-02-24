export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

export type ResponseInterceptor<T = unknown> = (response: T, config: RequestConfig) => T | Promise<T>;

export type ErrorInterceptor = (error: Error, config: RequestConfig) => void | Promise<void>;

export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
  skipAuth?: boolean;
  retryCount?: number;
  cacheKey?: string;
  cacheTTL?: number;
  metadata?: Record<string, unknown>;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition?: (error: Error, retryCount: number) => boolean;
  retryBackoff?: 'fixed' | 'exponential' | 'linear';
  maxRetryDelay?: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxSize: number;
  keyGenerator?: (config: RequestConfig) => string;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  timestamp?: boolean;
  colors?: boolean;
}

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export interface Interceptors {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
  error: ErrorInterceptor[];
}

export interface HttpClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: Partial<RetryConfig>;
  cache?: Partial<CacheConfig>;
  logger?: Partial<LoggerConfig>;
  interceptors?: Interceptors;
}

export interface SdkworkConfig extends HttpClientConfig {
  apiKey?: string;
  authToken?: string;
  accessToken?: string;
  tenantId?: string;
  organizationId?: string;
  platform?: string;
}

export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp?: string;
  traceId?: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  skipAuth?: boolean;
  timeout?: number;
  retry?: Partial<RetryConfig>;
  cache?: boolean | number;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

export type RequiredByKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type OptionalByKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
