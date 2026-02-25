export interface BasePlusVO {
  id?: string | number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type {
  SdkworkConfig,
  ApiResult,
  PageResult,
  RequestOptions,
  HttpMethod,
  LogLevel,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  RequestConfig,
  RetryConfig,
  CacheConfig,
  LoggerConfig,
  Interceptors,
  DeepPartial,
  PickByType,
  RequiredByKeys,
  OptionalByKeys,
} from './core';

export {
  SdkworkError,
  NetworkError,
  TimeoutError,
  AuthenticationError,
  TokenExpiredError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  CancelledError,
  isSdkworkError,
  isNetworkError,
  isAuthError,
  isRetryableError,
} from './errors';

export type { ErrorCode, ErrorDetail } from './errors';
