import type { HttpClient } from '../http/client';
import type { PageResult, RequestOptions } from '../types/core';

export interface BaseApiConfig {
  basePath: string;
}

export abstract class BaseApi {
  protected client: HttpClient;
  protected basePath: string;

  constructor(client: HttpClient, config?: BaseApiConfig) {
    this.client = client;
    this.basePath = config?.basePath ?? '';
  }

  protected buildPath(...parts: (string | number)[]): string {
    const pathParts = [this.basePath, ...parts.map(String)];
    return pathParts.filter(Boolean).join('/');
  }

  protected async get<T>(path: string, params?: Record<string, string | number | boolean | undefined>, _options?: RequestOptions): Promise<T> {
    return this.client.get<T>(this.buildPath(path), params);
  }

  protected async post<T>(path: string, body?: unknown, _options?: RequestOptions): Promise<T> {
    return this.client.post<T>(this.buildPath(path), body);
  }

  protected async put<T>(path: string, body?: unknown, _options?: RequestOptions): Promise<T> {
    return this.client.put<T>(this.buildPath(path), body);
  }

  protected async delete<T>(path: string, body?: unknown, _options?: RequestOptions): Promise<T> {
    return this.client.delete<T>(this.buildPath(path), body);
  }

  protected async patch<T>(path: string, body?: unknown, _options?: RequestOptions): Promise<T> {
    return this.client.patch<T>(this.buildPath(path), body);
  }

  protected async list<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T[]> {
    const result = await this.get<PageResult<T>>(path, params);
    return result.content;
  }

  protected async paginate<T>(
    path: string,
    page: number = 1,
    size: number = 20,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<PageResult<T>> {
    return this.get<PageResult<T>>(path, { page, size, ...params });
  }
}

export function createApiConfig(basePath: string): BaseApiConfig {
  return { basePath };
}
