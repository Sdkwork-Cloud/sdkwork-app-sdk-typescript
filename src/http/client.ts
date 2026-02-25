import type {
  SdkworkConfig,
  RequestConfig,
  RequestOptions,
  QueryParams,
} from '../types/core';
import { BaseHttpClient, type HttpClientOptions } from '@sdkwork/sdk-common/http';
import { withRetry, generateCacheKey, type CacheStore, createCacheStore, type Logger } from '@sdkwork/sdk-common/utils';

type RawRequestOptions = Omit<RequestOptions, 'body' | 'cache'> & {
  body?: unknown;
  rawBody?: BodyInit | null;
  skipJsonContentType?: boolean;
};

interface DeleteRequestOptions extends RequestOptions {
  data?: unknown;
}

export class HttpClient extends BaseHttpClient {
  declare protected logger: Logger;
  declare protected cache: CacheStore;

  constructor(config: SdkworkConfig) {
    super(config as HttpClientOptions);
    this.cache = createCacheStore();
  }

  override getConfig() {
    const tokenManager = this.getTokenManager();
    return {
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      authMode: this.getAuthMode(),
      apiKey: this.authConfig.apiKey,
      accessToken: tokenManager?.getAccessToken(),
      authToken: tokenManager?.getAuthToken(),
      tenantId: this.tenantId,
      organizationId: this.organizationId,
      platform: this.platform,
      userId: this.userId,
    };
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const requestConfig: RequestConfig = {
      url: path,
      method: options.method ?? 'GET',
      headers: options.headers,
      params: options.params,
      body: options.body,
      timeout: options.timeout,
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
      timeout: options.timeout,
      signal: options.signal,
      skipAuth: options.skipAuth,
      retryCount: 0,
    };

    const processedConfig = await this.applyRequestInterceptors(requestConfig);
    const url = this.buildApiUrl(processedConfig.url, processedConfig.params);
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

        const result = await this.executeFetch(url, {
          method: processedConfig.method,
          headers,
          body,
          timeout: processedConfig.timeout ?? 30000,
          signal: processedConfig.signal,
        });

        return result;
      },
      { maxRetries: 3, retryDelay: 1000, retryBackoff: 'exponential', maxRetryDelay: 30000 }
    );

    return response;
  }

  private async executeRequest<T>(config: RequestConfig, options: RequestOptions): Promise<T> {
    const processedConfig = await this.applyRequestInterceptors(config);

    const cacheKey = options.cache
      ? generateCacheKey(processedConfig)
      : undefined;

    if (cacheKey) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    const url = this.buildApiUrl(processedConfig.url, processedConfig.params);
    const headers = this.buildHeaders(processedConfig);

    const result = await withRetry(
      async () => {
        const response = await this.executeFetch(url, {
          method: processedConfig.method,
          headers,
          body: processedConfig.body ? JSON.stringify(processedConfig.body) : undefined,
          timeout: processedConfig.timeout ?? 30000,
          signal: processedConfig.signal,
        });

        return this.processResponse<T>(response, processedConfig);
      },
      { maxRetries: 3, retryDelay: 1000, retryBackoff: 'exponential', maxRetryDelay: 30000 }
    );

    if (cacheKey) {
      const ttl = typeof options.cache === 'number' ? options.cache : undefined;
      this.cache.set(cacheKey, result, ttl);
    }

    return this.applyResponseInterceptors(result, processedConfig);
  }

  private buildApiUrl(path: string, params?: QueryParams): string {
    if (this.isAbsoluteUrl(path)) {
      const url = new URL(path);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
          }
        });
      }
      return url.toString();
    }

    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    const pathWithLeadingSlash = path.startsWith('/') ? path : `/${path}`;
    const normalizedPath = this.normalizeApiPath(pathWithLeadingSlash);
    let url = `${baseUrl}${normalizedPath}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
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

  private normalizeDeleteOptions(body?: unknown): { body?: unknown; params?: QueryParams; headers?: Record<string, string>; signal?: AbortSignal; skipAuth?: boolean; timeout?: number } {
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
      'timeout' in options;

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
    };
  }
}

export function createHttpClient(config: SdkworkConfig): HttpClient {
  return new HttpClient(config);
}
