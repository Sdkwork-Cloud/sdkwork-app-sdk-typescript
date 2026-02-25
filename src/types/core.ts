export type {
  HttpMethod,
  LogLevel,
  QueryParams,
  HttpHeaders,
  ApiResult,
  PageResult,
  Pageable,
  Page,
  DeepPartial,
  PickByType,
  RequiredByKeys,
  OptionalByKeys,
  RequestConfig,
  RequestOptions,
  RetryConfig,
  CacheConfig,
  LoggerConfig,
  Interceptors,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  HttpClientConfig,
  SdkConfig,
} from '@sdkwork/sdk-common/core';

export { DEFAULT_RETRY_CONFIG, DEFAULT_CACHE_CONFIG, DEFAULT_LOGGER_CONFIG, DEFAULT_TIMEOUT, SUCCESS_CODES } from '@sdkwork/sdk-common/core';

import type { AuthTokenManager, AuthMode, AuthTokens } from '@sdkwork/sdk-common/auth';
export type { AuthTokenManager, AuthMode, AuthTokens };

export interface SdkworkConfig {
  baseUrl: string;
  apiKey?: string;
  authToken?: string;
  accessToken?: string;
  tenantId?: string;
  organizationId?: string;
  platform?: string;
  tokenManager?: AuthTokenManager;
  timeout?: number;
  authMode?: AuthMode;
}
