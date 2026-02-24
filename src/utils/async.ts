import { sleep } from './retry';

export { sleep };

export async function delay<T>(ms: number, value?: T): Promise<T | undefined> {
  await sleep(ms);
  return value;
}

export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: 'fixed' | 'exponential' | 'linear';
    maxDelay?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 'exponential', maxDelay = 30000, onRetry } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < retries) {
        onRetry?.(lastError, attempt + 1);

        let currentDelay: number;
        switch (backoff) {
          case 'exponential':
            currentDelay = Math.min(delay * Math.pow(2, attempt), maxDelay);
            break;
          case 'linear':
            currentDelay = Math.min(delay * (attempt + 1), maxDelay);
            break;
          default:
            currentDelay = delay;
        }

        await sleep(currentDelay);
      }
    }
  }

  throw lastError;
}

export async function retryWhile<T>(
  fn: () => Promise<T>,
  predicate: (result: T) => boolean,
  options: { interval?: number; maxAttempts?: number } = {}
): Promise<T> {
  const { interval = 1000, maxAttempts = 10 } = options;

  let attempts = 0;

  while (attempts < maxAttempts) {
    const result = await fn();
    if (!predicate(result)) {
      return result;
    }
    attempts++;
    if (attempts < maxAttempts) {
      await sleep(interval);
    }
  }

  throw new Error(`Max attempts (${maxAttempts}) reached`);
}

export async function parallel<T>(
  tasks: (() => Promise<T>)[],
  options: { concurrency?: number } = {}
): Promise<T[]> {
  const { concurrency = Infinity } = options;

  if (concurrency === Infinity) {
    return Promise.all(tasks.map((task) => task()));
  }

  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    if (!task) continue;
    const promise = task().then((result) => {
      results[i] = result;
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

export async function parallelLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  return parallel(tasks, { concurrency: limit });
}

export async function series<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}

export async function waterfall<T>(
  initial: T,
  fns: ((value: T) => Promise<T>)[]
): Promise<T> {
  let result = initial;

  for (const fn of fns) {
    result = await fn(result);
  }

  return result;
}

export async function each<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<void>
): Promise<void> {
  for (let i = 0; i < array.length; i++) {
    await fn(array[i]!, i);
  }
}

export async function eachParallel<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<void>,
  concurrency?: number
): Promise<void> {
  const tasks = array.map((value, index) => () => fn(value, index));
  await parallel(tasks, { concurrency });
}

export async function map<T, R>(
  array: T[],
  fn: (value: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < array.length; i++) {
    results.push(await fn(array[i]!, i));
  }

  return results;
}

export async function mapParallel<T, R>(
  array: T[],
  fn: (value: T, index: number) => Promise<R>,
  concurrency?: number
): Promise<R[]> {
  const tasks = array.map((value, index) => () => fn(value, index));
  return parallel(tasks, { concurrency });
}

export async function filter<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<boolean>
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (await fn(array[i]!, i)) {
      results.push(array[i]!);
    }
  }

  return results;
}

export async function filterParallel<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<boolean>,
  concurrency?: number
): Promise<T[]> {
  const tasks = array.map((value, index) => () => fn(value, index));
  const results = await parallel(tasks, { concurrency });

  return array.filter((_, index) => results[index]);
}

export async function reduce<T, R>(
  array: T[],
  fn: (accumulator: R, value: T, index: number) => Promise<R>,
  initial: R
): Promise<R> {
  let result = initial;

  for (let i = 0; i < array.length; i++) {
    result = await fn(result, array[i]!, i);
  }

  return result;
}

export async function find<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<boolean>
): Promise<T | undefined> {
  for (let i = 0; i < array.length; i++) {
    if (await fn(array[i]!, i)) {
      return array[i];
    }
  }
  return undefined;
}

export async function findIndex<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<boolean>
): Promise<number> {
  for (let i = 0; i < array.length; i++) {
    if (await fn(array[i]!, i)) {
      return i;
    }
  }
  return -1;
}

export async function every<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<boolean>
): Promise<boolean> {
  for (let i = 0; i < array.length; i++) {
    if (!(await fn(array[i]!, i))) {
      return false;
    }
  }
  return true;
}

export async function some<T>(
  array: T[],
  fn: (value: T, index: number) => Promise<boolean>
): Promise<boolean> {
  for (let i = 0; i < array.length; i++) {
    if (await fn(array[i]!, i)) {
      return true;
    }
  }
  return false;
}

export async function race<T>(promises: Promise<T>[]): Promise<T> {
  return Promise.race(promises);
}

export async function all<T>(promises: Promise<T>[]): Promise<T[]> {
  return Promise.all(promises);
}

export async function allSettled<T>(
  promises: Promise<T>[]
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(promises);
}

export async function any<T>(promises: Promise<T>[]): Promise<T> {
  return Promise.any(promises);
}

export async function tryUntil<T>(
  fn: () => Promise<T>,
  predicate: (result: T) => boolean,
  options: { interval?: number; timeout?: number } = {}
): Promise<T> {
  const { interval = 1000, timeout = 30000 } = options;
  const startTime = Date.now();

  while (true) {
    const result = await fn();
    if (predicate(result)) {
      return result;
    }

    if (Date.now() - startTime >= timeout) {
      throw new Error(`Timeout after ${timeout}ms`);
    }

    await sleep(interval);
  }
}

export function createDeferred<T = void>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve: resolve!, reject: reject! };
}

export function createSemaphore(max: number): {
  acquire: () => Promise<() => void>;
  release: () => void;
} {
  let current = 0;
  const queue: Array<() => void> = [];

  const acquire = (): Promise<() => void> => {
    return new Promise((resolve) => {
      if (current < max) {
        current++;
        resolve(() => {
          current--;
          const next = queue.shift();
          if (next) {
            current++;
            next();
          }
        });
      } else {
        queue.push(() => {
          current++;
          resolve(() => {
            current--;
            const next = queue.shift();
            if (next) {
              current++;
              next();
            }
          });
        });
      }
    });
  };

  const release = (): void => {
    const next = queue.shift();
    if (next) {
      next();
    } else {
      current = Math.max(0, current - 1);
    }
  };

  return { acquire, release };
}

export function createMutex(): {
  acquire: () => Promise<() => void>;
} {
  const semaphore = createSemaphore(1);
  return {
    acquire: semaphore.acquire,
  };
}

export class AsyncQueue<T> {
  private queue: T[] = [];
  private pending: Array<{
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
  }> = [];
  private closed = false;

  push(value: T): void {
    if (this.closed) {
      throw new Error('Queue is closed');
    }

    const waiter = this.pending.shift();
    if (waiter) {
      waiter.resolve(value);
    } else {
      this.queue.push(value);
    }
  }

  async pop(): Promise<T> {
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }

    if (this.closed) {
      throw new Error('Queue is closed');
    }

    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
    });
  }

  close(): void {
    this.closed = true;
    this.pending.forEach((waiter) => {
      waiter.reject(new Error('Queue is closed'));
    });
    this.pending = [];
  }

  get length(): number {
    return this.queue.length;
  }

  get isClosed(): boolean {
    return this.closed;
  }
}

export class AsyncLock {
  private locked = false;
  private queue: Array<() => void> = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
    } else {
      this.locked = false;
    }
  }

  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

export class AsyncEventEmitter<Events extends Record<string, unknown>> {
  private handlers: Map<keyof Events, Set<(data: unknown) => void | Promise<void>>> = new Map();

  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void | Promise<void>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as (data: unknown) => void | Promise<void>);

    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void | Promise<void>): void {
    this.handlers.get(event)?.delete(handler as (data: unknown) => void | Promise<void>);
  }

  async emit<K extends keyof Events>(event: K, data: Events[K]): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    await Promise.all(
      Array.from(handlers).map((handler) => handler(data))
    );
  }

  removeAllListeners(event?: keyof Events): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}
