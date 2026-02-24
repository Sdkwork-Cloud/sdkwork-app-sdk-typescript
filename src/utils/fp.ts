export type Pipe<T> = (value: T) => T;

export type Compose<T> = (...funcs: Array<(value: T) => T>) => (value: T) => T;

export function pipe<T>(...funcs: Array<(value: T) => T>): (value: T) => T {
  return (value: T) => funcs.reduce((acc, fn) => fn(acc), value);
}

export function compose<T>(...funcs: Array<(value: T) => T>): (value: T) => T {
  return (value: T) => funcs.reduceRight((acc, fn) => fn(acc), value);
}

export function curry<T extends (...args: unknown[]) => unknown>(fn: T): (...args: unknown[]) => unknown {
  const arity = fn.length;

  return function curried(...args: unknown[]): unknown {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs: unknown[]) => curried(...args, ...moreArgs);
  };
}

export function partial<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ...presetArgs: unknown[]
): (...args: unknown[]) => ReturnType<T> {
  return (...laterArgs: unknown[]) => fn(...presetArgs, ...laterArgs) as ReturnType<T>;
}

export function flip<T extends (a: unknown, b: unknown, ...rest: unknown[]) => unknown>(fn: T): T {
  return ((a: unknown, b: unknown, ...rest: unknown[]) => fn(b, a, ...rest)) as T;
}

export function negate<T extends (...args: unknown[]) => boolean>(fn: T): T {
  return ((...args: Parameters<T>) => !fn(...args)) as T;
}

export function tap<T>(fn: (value: T) => void): (value: T) => T {
  return (value: T) => {
    fn(value);
    return value;
  };
}

export function identity<T>(value: T): T {
  return value;
}

export function always<T>(value: T): () => T {
  return () => value;
}

export function noop(): void {}

export function T(): boolean {
  return true;
}

export function F(): boolean {
  return false;
}

export function when<T, U>(
  predicate: (value: T) => boolean,
  trueFn: (value: T) => U,
  falseFn?: (value: T) => U
): (value: T) => U | T {
  return (value: T) => {
    if (predicate(value)) {
      return trueFn(value);
    }
    return falseFn ? falseFn(value) : value;
  };
}

export function unless<T, U>(
  predicate: (value: T) => boolean,
  falseFn: (value: T) => U,
  trueFn?: (value: T) => U
): (value: T) => U | T {
  return (value: T) => {
    if (!predicate(value)) {
      return falseFn(value);
    }
    return trueFn ? trueFn(value) : value;
  };
}

export function ifElse<T, U>(
  predicate: (value: T) => boolean,
  trueFn: (value: T) => U,
  falseFn: (value: T) => U
): (value: T) => U {
  return (value: T) => (predicate(value) ? trueFn(value) : falseFn(value));
}

export function cond<T, U>(pairs: Array<[(value: T) => boolean, (value: T) => U]>): (value: T) => U | undefined {
  return (value: T) => {
    for (const [predicate, fn] of pairs) {
      if (predicate(value)) {
        return fn(value);
      }
    }
    return undefined;
  };
}

export function until<T>(
  predicate: (value: T) => boolean,
  fn: (value: T) => T
): (value: T) => T {
  return (value: T) => {
    let result = value;
    while (!predicate(result)) {
      result = fn(result);
    }
    return result;
  };
}

export function memoizeWith<T extends (...args: unknown[]) => unknown>(
  keyFn: (...args: Parameters<T>) => string,
  fn: T
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyFn(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

export function once<T extends (...args: unknown[]) => unknown>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<T>;
    }
    return result;
  }) as T;
}

export function before<T extends (...args: unknown[]) => unknown>(
  n: number,
  fn: T
): T {
  let count = 0;
  let lastResult: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (count < n) {
      count++;
      lastResult = fn(...args) as ReturnType<T>;
    }
    return lastResult;
  }) as T;
}

export function after<T extends (...args: unknown[]) => unknown>(
  n: number,
  fn: T
): T {
  let count = 0;

  return ((...args: Parameters<T>) => {
    count++;
    if (count > n) {
      return fn(...args);
    }
    return undefined;
  }) as T;
}

export function only<T extends (...args: unknown[]) => unknown>(
  n: number,
  fn: T
): T {
  let count = 0;

  return ((...args: Parameters<T>) => {
    count++;
    if (count <= n) {
      return fn(...args);
    }
    return undefined;
  }) as T;
}

export function debounceFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...lastArgs!);
      timeoutId = null;
      lastArgs = null;
    }, wait);
  };

  (debounced as unknown as { cancel: () => void; flush: () => void }).cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  (debounced as unknown as { cancel: () => void; flush: () => void }).flush = () => {
    if (timeoutId && lastArgs) {
      fn(...lastArgs);
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  return debounced as T & { cancel: () => void; flush: () => void };
}

export function throttleFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): T {
  let inThrottle = false;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  }) as T;
}

export function ary<T extends (...args: unknown[]) => unknown>(fn: T, n: number): T {
  return ((...args: Parameters<T>) => fn(...args.slice(0, n))) as T;
}

export function unary<T extends (arg: unknown, ...rest: unknown[]) => unknown>(fn: T): T {
  return ((arg: unknown) => fn(arg)) as T;
}

export function binary<T extends (a: unknown, b: unknown, ...rest: unknown[]) => unknown>(fn: T): T {
  return ((a: unknown, b: unknown) => fn(a, b)) as T;
}

export function nAry<T extends (...args: unknown[]) => unknown>(n: number, fn: T): T {
  return ((...args: Parameters<T>) => fn(...args.slice(0, n))) as T;
}

export function rearg<T extends (...args: unknown[]) => unknown>(fn: T, indexes: number[]): T {
  return ((...args: Parameters<T>) => {
    const reordered = indexes.map((i) => args[i]);
    return fn(...reordered);
  }) as T;
}
