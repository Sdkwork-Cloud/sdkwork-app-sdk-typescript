type PendingRequest<T> = {
  promise: Promise<T>;
  timestamp: number;
};

export class RequestDeduplicator {
  private pendingRequests: Map<string, PendingRequest<unknown>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL: number = 100) {
    this.defaultTTL = defaultTTL;
  }

  async dedupe<T>(
    key: string,
    request: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const existing = this.pendingRequests.get(key);
    
    if (existing && Date.now() - existing.timestamp < ttl) {
      return existing.promise as Promise<T>;
    }

    const promise = request().finally(() => {
      setTimeout(() => {
        if (this.pendingRequests.get(key)?.promise === promise) {
          this.pendingRequests.delete(key);
        }
      }, ttl);
    });

    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
    });

    return promise;
  }

  has(key: string): boolean {
    return this.pendingRequests.has(key);
  }

  clear(key?: string): void {
    if (key) {
      this.pendingRequests.delete(key);
    } else {
      this.pendingRequests.clear();
    }
  }

  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  getPendingKeys(): string[] {
    return Array.from(this.pendingRequests.keys());
  }
}

export function createRequestDeduplicator(ttl?: number): RequestDeduplicator {
  return new RequestDeduplicator(ttl);
}

export interface DebounceOptions {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: number | DebounceOptions
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  const opts = typeof options === 'number' ? { wait: options } : options;
  const { wait, leading = false, trailing = true, maxWait } = opts;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime = 0;
  let lastInvokeTime = 0;

  function invokeFunc(): void {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function startTimer(pendingFunc: () => void): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(pendingFunc, wait);
  }

  function trailingEdge(): void {
    timeoutId = null;
    if (trailing && lastArgs) {
      invokeFunc();
    }
  }

  function leadingEdge(): void {
    timeoutId = null;
    if (leading) {
      invokeFunc();
    }
  }

  function debounced(...args: Parameters<T>): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        lastInvokeTime = time;
        if (leading) {
          startTimer(trailingEdge);
          invokeFunc();
        } else {
          startTimer(trailingEdge);
        }
      } else if (maxWait !== undefined) {
        startTimer(trailingEdge);
      }
    } else if (timeoutId === null) {
      startTimer(trailing ? trailingEdge : leadingEdge);
    }
  }

  debounced.cancel = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastCallTime = 0;
  };

  debounced.flush = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    invokeFunc();
  };

  return debounced;
}

export interface ThrottleOptions {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: number | ThrottleOptions
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  const opts = typeof options === 'number' ? { wait: options } : options;
  const { wait, leading = true, trailing = true } = opts;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime = 0;

  function invokeFunc(): void {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  }

  function startTimer(pendingFunc: () => void): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(pendingFunc, wait);
  }

  function trailingEdge(): void {
    timeoutId = null;
    if (trailing && lastArgs) {
      invokeFunc();
    }
  }

  function throttled(...args: Parameters<T>): void {
    const time = Date.now();
    const remaining = wait - (time - lastCallTime);

    lastArgs = args;

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCallTime = time;
      if (leading) {
        invokeFunc();
      }
    } else if (timeoutId === null && trailing) {
      startTimer(trailingEdge);
    }
  }

  throttled.cancel = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastCallTime = 0;
  };

  throttled.flush = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    invokeFunc();
  };

  return throttled;
}

export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
): T & { cache: Map<string, unknown> } {
  const cache = new Map<string, unknown>();

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T & { cache: Map<string, unknown> };

  memoized.cache = cache;

  return memoized;
}

export function once<T extends (...args: unknown[]) => unknown>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<T>;
    }
    return result;
  }) as T;
}

export function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: 'fixed' | 'exponential' | 'linear';
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 'exponential', onRetry } = options;

  return new Promise((resolve, reject) => {
    let attempt = 0;

    const execute = async (): Promise<void> => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        attempt++;

        if (attempt > retries) {
          reject(error);
          return;
        }

        onRetry?.(error as Error, attempt);

        const currentDelay =
          backoff === 'exponential'
            ? delay * Math.pow(2, attempt - 1)
            : backoff === 'linear'
            ? delay * attempt
            : delay;

        setTimeout(execute, currentDelay);
      }
    };

    execute();
  });
}

export type { PendingRequest };
