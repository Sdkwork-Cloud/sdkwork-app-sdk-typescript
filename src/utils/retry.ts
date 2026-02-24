import type { RetryConfig } from '../types/core';
import { SdkworkError, NetworkError, TimeoutError, RateLimitError } from '../types/errors';

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryBackoff: 'exponential',
  maxRetryDelay: 30000,
  retryCondition: defaultRetryCondition,
};

function defaultRetryCondition(error: Error, _retryCount: number): boolean {
  if (error instanceof RateLimitError) {
    return true;
  }

  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }

  if (error instanceof SdkworkError) {
    return error.isRetryable();
  }

  return false;
}

export function calculateDelay(
  retryCount: number,
  config: RetryConfig
): number {
  const { retryDelay, retryBackoff, maxRetryDelay } = config;

  let delay: number;

  switch (retryBackoff) {
    case 'exponential':
      delay = retryDelay * Math.pow(2, retryCount);
      break;
    case 'linear':
      delay = retryDelay * (retryCount + 1);
      break;
    case 'fixed':
    default:
      delay = retryDelay;
      break;
  }

  return Math.min(delay, maxRetryDelay ?? delay);
}

export function createRetryConfig(config?: Partial<RetryConfig>): RetryConfig {
  return {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = createRetryConfig(config);
  let lastError: Error | null = null;
  let retryCount = 0;

  while (retryCount <= retryConfig.maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      const shouldRetry = retryConfig.retryCondition?.(lastError, retryCount) ?? false;

      if (!shouldRetry || retryCount >= retryConfig.maxRetries) {
        throw lastError;
      }

      const delay = calculateDelay(retryCount, retryConfig);
      await sleep(delay);

      retryCount++;
    }
  }

  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

export { DEFAULT_RETRY_CONFIG };
