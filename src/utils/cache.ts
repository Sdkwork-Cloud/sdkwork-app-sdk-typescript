import type { CacheConfig, CacheEntry, RequestConfig } from '../types/core';

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  enabled: false,
  ttl: 5 * 60 * 1000,
  maxSize: 100,
};

class CacheStore {
  private cache: Map<string, CacheEntry> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.config.ttl,
      key,
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.timestamp + entry.ttl;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  cleanup(): number {
    let cleaned = 0;
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    return cleaned;
  }
}

let globalCache: CacheStore | null = null;

export function getCache(config?: Partial<CacheConfig>): CacheStore {
  if (!globalCache) {
    globalCache = new CacheStore(config);
  }
  return globalCache;
}

export function createCache(config?: Partial<CacheConfig>): CacheStore {
  return new CacheStore(config);
}

export function generateCacheKey(config: RequestConfig): string {
  const { url, method, params, body } = config;
  const parts = [method, url];

  if (params && Object.keys(params).length > 0) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`);
    parts.push(`?${sortedParams.join('&')}`);
  }

  if (body) {
    parts.push(JSON.stringify(body));
  }

  return parts.join(':');
}

export function clearGlobalCache(): void {
  if (globalCache) {
    globalCache.clear();
  }
}

export { CacheStore };
