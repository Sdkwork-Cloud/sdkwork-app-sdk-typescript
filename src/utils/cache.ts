import { createCacheStore, generateCacheKey, MemoryCacheStore, type CacheStore } from '@sdkwork/sdk-common/utils';

export { createCacheStore, generateCacheKey, MemoryCacheStore, type CacheStore };

export const createCache = createCacheStore;
export const getCache = createCacheStore;
export function clearGlobalCache(): void {}
