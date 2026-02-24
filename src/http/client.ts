import type {
  SdkworkConfig,
  RequestConfig,
  ApiResult,
  RequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  Interceptors,
  RetryConfig,
} from '../types/core';
import { createLogger, type Logger } from '../utils/logger';
import { createCache, generateCacheKey } from '../utils/cache';
import { withRetry, createRetryConfig } from '../utils/retry';
import {
  SdkworkError,
  NetworkError,
  TimeoutError,
  CancelledError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from '../types/errors';

const SUCCESS_CODES = [0, 200, 2000];
type QueryParams = Record<string, string | number | boolean | undefined>;

interface RawRequestOptions extends Omit<RequestOptions, 'body' | 'cache'> {
  body?: unknown;
  rawBody?: BodyInit | null;
  skipJsonContentType?: boolean;
}

interface DeleteRequestOptions extends RequestOptions {
  data?: unknown;
}

export class HttpClient {
  private config: {
    baseUrl: string;
    timeout: number;
    headers: Record<string, string>;
    apiKey?: string;
    authToken?: string;
    accessToken?: string;
    tenantId?: string;
    organizationId?: string;
    platform?: string;
    retry: RetryConfig;
  };
  private logger: Logger;
  private cache: ReturnType<typeof createCache>;
  private interceptors: Interceptors = {
    request: [],
    response: [],
    error: [],
  };

  constructor(config: SdkworkConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      timeout: config.timeout ?? 30000,
      headers: config.headers ?? {},
      apiKey: config.apiKey,
      authToken: config.authToken,
      accessToken: config.accessToken,
      tenantId: config.tenantId,
      organizationId: config.organizationId,
      platform: config.platform,
      retry: createRetryConfig(config.retry),
    };
    this.logger = createLogger(config.logger);
    this.cache = createCache(config.cache);

    if (config.interceptors) {
      this.interceptors = { ...config.interceptors };
    }
  }

  getConfig() {
    return {
      baseUrl: this.config.baseUrl,
      authToken: this.config.authToken,
      accessToken: this.config.accessToken,
      apiKey: this.config.apiKey,
      tenantId: this.config.tenantId,
      organizationId: this.config.organizationId,
      platform: this.config.platform,
    };
  }

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.interceptors.request.push(interceptor);
    return () => {
      const index = this.interceptors.request.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.request.splice(index, 1);
      }
    };
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.interceptors.response.push(interceptor);
    return () => {
      const index = this.interceptors.response.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.response.splice(index, 1);
      }
    };
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.interceptors.error.push(interceptor);
    return () => {
      const index = this.interceptors.error.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.error.splice(index, 1);
      }
    };
  }

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  setAuthToken(token: string): void {
    this.config.authToken = token;
  }

  setAccessToken(token: string): void {
    this.config.accessToken = token;
  }

  setTenantId(tenantId: string): void {
    this.config.tenantId = tenantId;
  }

  setOrganizationId(organizationId: string): void {
    this.config.organizationId = organizationId;
  }

  setPlatform(platform: string): void {
    this.config.platform = platform;
  }

  clearAuthToken(): void {
    this.config.authToken = undefined;
    this.config.accessToken = undefined;
  }

  clearCache(): void {
    this.cache.clear();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const requestConfig: RequestConfig = {
      url: path,
      method: options.method ?? 'GET',
      headers: options.headers,
      params: options.params,
      body: options.body,
      timeout: options.timeout ?? this.config.timeout,
      signal: options.signal,
      skipAuth: options.skipAuth,
      retryCount: 0,
    };

    return this.executeRequest<T>(requestConfig, options);
  }

  async requestRaw(path: string, options: RawRequestOptions = {}): Promise<Response> {
    const requestConfig: RequestConfig = {
      url: path,
      method: options.method ?? 'GET',
      headers: options.headers,
      params: options.params,
      body: options.body,
      timeout: options.timeout ?? this.config.timeout,
      signal: options.signal,
      skipAuth: options.skipAuth,
      retryCount: 0,
    };

    try {
      const processedConfig = await this.applyRequestInterceptors(requestConfig);
      const url = this.buildUrl(processedConfig.url, processedConfig.params);
      const useRawBody = options.rawBody !== undefined;
      const headers = this.buildHeaders(
        processedConfig,
        options.skipJsonContentType === true || useRawBody
      );

      const response = await withRetry(
        async () => {
          const body = useRawBody
            ? options.rawBody
            : processedConfig.body
              ? JSON.stringify(processedConfig.body)
              : undefined;

          const result = await this.fetch(url, {
            method: processedConfig.method,
            headers,
            body,
            timeout: processedConfig.timeout ?? this.config.timeout,
            signal: processedConfig.signal,
          });

          if (!result.ok) {
            await this.handleErrorResponse(result);
          }

          return result;
        },
        {
          ...this.config.retry,
          ...options.retry,
        }
      );

      return response;
    } catch (error) {
      await this.applyErrorInterceptors(error as Error, requestConfig);
      throw error;
    }
  }

  private async executeRequest<T>(config: RequestConfig, options: RequestOptions): Promise<T> {
    try {
      let processedConfig = await this.applyRequestInterceptors(config);

      const cacheKey = options.cache
        ? generateCacheKey(processedConfig)
        : undefined;

      if (cacheKey) {
        const cached = this.cache.get<T>(cacheKey);
        if (cached !== null) {
          this.logger.debug('Cache hit:', cacheKey);
          return cached;
        }
      }

      const url = this.buildUrl(processedConfig.url, processedConfig.params);
      const headers = this.buildHeaders(processedConfig);

      const result = await withRetry(
        async () => {
          const response = await this.fetch(url, {
            method: processedConfig.method,
            headers,
            body: processedConfig.body ? JSON.stringify(processedConfig.body) : undefined,
            timeout: processedConfig.timeout ?? this.config.timeout,
            signal: processedConfig.signal,
          });

          return this.processResponse<T>(response, processedConfig);
        },
        {
          ...this.config.retry,
          ...options.retry,
        }
      );

      if (cacheKey) {
        const ttl = typeof options.cache === 'number' ? options.cache : undefined;
        this.cache.set(cacheKey, result, ttl);
      }

      return this.applyResponseInterceptors(result, processedConfig);
    } catch (error) {
      await this.applyErrorInterceptors(error as Error, config);
      throw error;
    }
  }

  private async fetch(
    url: string,
    options: {
      method: string;
      headers: Record<string, string>;
      body?: BodyInit | null;
      timeout: number;
      signal?: AbortSignal;
    }
  ): Promise<Response> {
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, options.timeout);

    const abortHandler = () => controller.abort();

    if (options.signal) {
      if (options.signal.aborted) {
        controller.abort();
      } else {
        options.signal.addEventListener('abort', abortHandler, { once: true });
      }
    }

    try {
      this.logger.debug(`${options.method} ${url}`);

      const response = await fetch(url, {
        method: options.method,
        headers: options.headers,
        body: options.body,
        signal: controller.signal,
      });

      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          if (timedOut) {
            throw new TimeoutError(`Request timeout after ${options.timeout}ms`);
          }
          throw new CancelledError('Request was cancelled');
        }
        throw new NetworkError(error.message);
      }

      throw new NetworkError('Unknown network error');
    } finally {
      clearTimeout(timeoutId);
      if (options.signal) {
        options.signal.removeEventListener('abort', abortHandler);
      }
    }
  }

  private async processResponse<T>(response: Response, _config: RequestConfig): Promise<T> {
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const result: ApiResult<T> = await response.json();

    if (!SUCCESS_CODES.includes(result.code)) {
      throw SdkworkError.fromApiResult(result);
    }

    return result.data;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorData: unknown;

    try {
      const result = await response.json();
      errorMessage = result.message || errorMessage;
      errorData = result.data;
    } catch {
      // Ignore JSON parse errors
    }

    switch (response.status) {
      case 400:
        throw new ValidationError(errorMessage);
      case 401:
        throw new AuthenticationError(errorMessage);
      case 403:
        throw new ForbiddenError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 429: {
        const retryAfter = response.headers.get('Retry-After');
        throw new RateLimitError(errorMessage, retryAfter ? parseInt(retryAfter, 10) : undefined);
      }
      default:
        if (response.status >= 500) {
          throw new ServerError(errorMessage, response.status);
        }
        throw new SdkworkError(errorMessage, response.status, 'UNKNOWN', errorData);
    }
  }

  private buildUrl(path: string, params?: QueryParams): string {
    const url = this.buildRequestUrl(path);
    if (!params) {
      return url.toString();
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  }

  private buildRequestUrl(path: string): URL {
    if (this.isAbsoluteUrl(path)) {
      return new URL(path);
    }

    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
    const normalizedPath = this.normalizeApiPath(pathWithLeadingSlash);
    return new URL(`${baseUrl}${normalizedPath}`);
  }

  private isAbsoluteUrl(path: string): boolean {
    return /^[a-z][a-z\d+\-.]*:\/\//i.test(path);
  }

  private normalizeApiPath(path: string): string {
    if (/^\/v3\/api(?:\/|$)/.test(path)) {
      return path.replace(/^\/v3\/api/, '/app/v3/api');
    }

    return path;
  }

  private buildHeaders(config: RequestConfig, skipJsonContentType: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      ...this.config.headers,
      ...config.headers,
    };

    const hasContentType = Object.keys(headers).some((key) => key.toLowerCase() === 'content-type');
    if (!skipJsonContentType && !hasContentType) {
      headers['Content-Type'] = 'application/json';
    }

    if (!config.skipAuth) {
      if (this.config.authToken) {
        headers['Authorization'] = `Bearer ${this.config.authToken}`;
      }

      if (this.config.accessToken) {
        headers['Access-Token'] = this.config.accessToken;
      }

      if (this.config.apiKey) {
        headers['X-Api-Key'] = this.config.apiKey;
      }

      if (this.config.tenantId) {
        headers['X-Tenant-Id'] = this.config.tenantId;
      }

      if (this.config.organizationId) {
        headers['X-Organization-Id'] = this.config.organizationId;
      }

      if (this.config.platform) {
        headers['X-Platform'] = this.config.platform;
      }
    }

    return headers;
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config;

    for (const interceptor of this.interceptors.request) {
      processedConfig = await interceptor(processedConfig);
    }

    return processedConfig;
  }

  private async applyResponseInterceptors<T>(response: T, config: RequestConfig): Promise<T> {
    let processedResponse: T = response;

    for (const interceptor of this.interceptors.response) {
      processedResponse = (await interceptor(processedResponse, config)) as T;
    }

    return processedResponse;
  }

  private async applyErrorInterceptors(error: Error, config: RequestConfig): Promise<void> {
    for (const interceptor of this.interceptors.error) {
      await interceptor(error, config);
    }
  }

  async get<T>(path: string, params?: unknown): Promise<T> {
    const normalized = this.normalizeGetParams(params);
    return this.request<T>(path, { method: 'GET', params: normalized });
  }

  async post<T>(path: string, body?: unknown, params?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body,
      params: this.normalizeGetParams(params),
    });
  }

  async put<T>(path: string, body?: unknown, params?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body,
      params: this.normalizeGetParams(params),
    });
  }

  async delete<T>(path: string, body?: unknown, params?: unknown): Promise<T> {
    const normalized = this.normalizeDeleteOptions(body);
    const extraParams = this.normalizeGetParams(params);
    return this.request<T>(path, {
      method: 'DELETE',
      ...normalized,
      params: extraParams ?? normalized.params,
    });
  }

  async patch<T>(path: string, body?: unknown, params?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body,
      params: this.normalizeGetParams(params),
    });
  }

  private normalizeGetParams(params?: unknown): QueryParams | undefined {
    if (!params || typeof params !== 'object') {
      return undefined;
    }

    if ('params' in (params as Record<string, unknown>)) {
      return (params as { params?: QueryParams }).params;
    }

    return params as QueryParams;
  }

  private normalizeDeleteOptions(body?: unknown): Pick<RequestOptions, 'body' | 'params' | 'headers' | 'signal' | 'skipAuth' | 'timeout' | 'retry' | 'cache'> {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return { body };
    }

    const options = body as DeleteRequestOptions;
    const isDeleteOptions =
      'data' in options ||
      'params' in options ||
      'headers' in options ||
      'signal' in options ||
      'skipAuth' in options ||
      'timeout' in options ||
      'retry' in options ||
      'cache' in options;

    if (!isDeleteOptions) {
      return { body };
    }

    return {
      body: options.data,
      params: options.params,
      headers: options.headers,
      signal: options.signal,
      skipAuth: options.skipAuth,
      timeout: options.timeout,
      retry: options.retry,
      cache: options.cache,
    };
  }
}

export function createHttpClient(config: SdkworkConfig): HttpClient {
  return new HttpClient(config);
}
