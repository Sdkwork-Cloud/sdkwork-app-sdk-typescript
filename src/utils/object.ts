export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function values<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}

export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export function fromEntries<K extends string | number | symbol, V>(entries: [K, V][]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

export function assign<T extends object>(target: T, ...sources: Partial<T>[]): T {
  return Object.assign({}, target, ...sources);
}

export function merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  const result = { ...target };

  for (const source of sources) {
    for (const key in source) {
      if (source[key] !== undefined) {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

export function mergeWith<T extends object>(
  target: T,
  source: Partial<T>,
  customizer: (targetValue: unknown, sourceValue: unknown, key: keyof T) => unknown
): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      const targetValue = target[key];
      const sourceValue = source[key];
      result[key] = customizer(targetValue, sourceValue, key) as T[Extract<keyof T, string>];
    }
  }

  return result;
}

export function defaults<T extends object>(obj: T, ...sources: Partial<T>[]): T {
  const result = { ...obj };

  for (const source of sources) {
    for (const key in source) {
      if (result[key] === undefined) {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function pickBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}

export function omitBy<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (!predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function invert<T extends Record<string | number | symbol, string | number | symbol>>(
  obj: T
): Record<T[keyof T], keyof T> {
  const result = {} as Record<T[keyof T], keyof T>;

  for (const key in obj) {
    result[obj[key]] = key;
  }

  return result;
}

export function invertBy<T extends Record<string, string | number>>(
  obj: T,
  transform?: (key: keyof T) => string
): Record<string, (keyof T)[]> {
  const result: Record<string, (keyof T)[]> = {};

  for (const key in obj) {
    const value = transform ? transform(obj[key] as keyof T) : String(obj[key]);
    if (!result[value]) {
      result[value] = [];
    }
    result[value].push(key);
  }

  return result;
}

export function mapKeys<T extends object>(
  obj: T,
  iteratee: (value: T[keyof T], key: keyof T) => string
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};

  for (const key in obj) {
    result[iteratee(obj[key], key)] = obj[key];
  }

  return result;
}

export function mapValues<T extends object, R>(
  obj: T,
  iteratee: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;

  for (const key in obj) {
    result[key] = iteratee(obj[key], key);
  }

  return result;
}

export function findKey<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): keyof T | undefined {
  for (const key in obj) {
    if (predicate(obj[key], key)) {
      return key;
    }
  }
  return undefined;
}

export function findLastKey<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): keyof T | undefined {
  const allKeys = Object.keys(obj);
  for (let i = allKeys.length - 1; i >= 0; i--) {
    const key = allKeys[i] as keyof T;
    if (predicate(obj[key], key)) {
      return key;
    }
  }
  return undefined;
}

export function has<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function hasIn(obj: unknown, key: PropertyKey): boolean {
  return key in (obj as object);
}

export function get<T extends object, K extends keyof T>(obj: T, key: K): T[K];
export function get<T extends object, D>(obj: T, key: PropertyKey, defaultValue: D): D | T[keyof T];
export function get<T extends object, D>(
  obj: T,
  key: PropertyKey,
  defaultValue?: D
): D | T[keyof T] | undefined {
  if (key in obj) {
    return obj[key as keyof T];
  }
  return defaultValue;
}

export function set<T extends object>(obj: T, key: keyof T, value: T[keyof T]): T {
  return { ...obj, [key]: value };
}

export function unset<T extends object>(obj: T, key: keyof T): Omit<T, keyof T> {
  const result = { ...obj };
  delete result[key];
  return result;
}

export function update<T extends object>(
  obj: T,
  key: keyof T,
  updater: (value: T[keyof T]) => T[keyof T]
): T {
  return { ...obj, [key]: updater(obj[key]) };
}

export function updateWith<T extends object>(
  obj: T,
  key: keyof T,
  updater: (value: T[keyof T] | undefined) => T[keyof T],
  defaultValue: T[keyof T]
): T {
  return { ...obj, [key]: updater(key in obj ? obj[key] : defaultValue) };
}

export function at<T extends object>(obj: T, paths: (keyof T)[]): (T[keyof T] | undefined)[] {
  return paths.map((path) => obj[path]);
}

export function paths<T extends object>(obj: T, path: string): unknown {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result;
}

export function setPath<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.');
  const result = { ...obj } as Record<string, unknown>;
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key !== undefined) {
      current[key] = { ...(current[key] as object) };
      current = current[key] as Record<string, unknown>;
    }
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey !== undefined) {
    current[lastKey] = value;
  }
  return result as T;
}

export function toPairs<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return entries(obj);
}

export function fromPairs<K extends string | number | symbol, V>(pairs: [K, V][]): Record<K, V> {
  return fromEntries(pairs);
}

export function size<T extends object>(obj: T): number {
  return Object.keys(obj).length;
}

export function isEmpty<T extends object>(obj: T): boolean {
  return Object.keys(obj).length === 0;
}

export function isNotEmpty<T extends object>(obj: T): boolean {
  return Object.keys(obj).length > 0;
}

export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;

  if (a === null || b === null) return false;

  if (typeof a !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}

export function isMatch<T extends object>(obj: T, source: Partial<T>): boolean {
  for (const key in source) {
    if (obj[key] !== source[key]) {
      return false;
    }
  }
  return true;
}

export function matches<T extends object>(source: Partial<T>): (obj: T) => boolean {
  return (obj: T) => isMatch(obj, source);
}

export function matchesProperty<T extends object, K extends keyof T>(
  path: K,
  sourceValue: T[K]
): (obj: T) => boolean {
  return (obj: T) => obj[path] === sourceValue;
}

export function property<T extends object, K extends keyof T>(path: K): (obj: T) => T[K] {
  return (obj: T) => obj[path];
}

export function propertyOf<T extends object>(obj: T): <K extends keyof T>(path: K) => T[K] {
  return <K extends keyof T>(path: K) => obj[path];
}

export function clone<T extends object>(obj: T): T {
  return { ...obj };
}

export function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => cloneDeep(item)) as unknown as T;
  }

  if (obj instanceof Date) {
    return new Date(obj) as unknown as T;
  }

  if (obj instanceof Map) {
    const result = new Map();
    obj.forEach((value, key) => {
      result.set(cloneDeep(key), cloneDeep(value));
    });
    return result as unknown as T;
  }

  if (obj instanceof Set) {
    const result = new Set();
    obj.forEach((value) => {
      result.add(cloneDeep(value));
    });
    return result as unknown as T;
  }

  const result = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = cloneDeep(obj[key]);
    }
  }

  return result;
}

export function transform<T extends object, R>(
  obj: T,
  iteratee: (result: R, value: T[keyof T], key: keyof T) => boolean | void,
  accumulator: R
): R {
  for (const key in obj) {
    const shouldContinue = iteratee(accumulator, obj[key], key);
    if (shouldContinue === false) {
      break;
    }
  }
  return accumulator;
}

export function functions<T extends object>(obj: T): (keyof T)[] {
  const result: (keyof T)[] = [];

  for (const key in obj) {
    if (typeof obj[key] === 'function') {
      result.push(key);
    }
  }

  return result;
}

export function functionsIn<T extends object>(obj: T): (keyof T)[] {
  const result: (keyof T)[] = [];

  for (const key in obj) {
    if (typeof (obj as Record<string, unknown>)[key as string] === 'function') {
      result.push(key);
    }
  }

  return result;
}

export function forIn<T extends object>(
  obj: T,
  iteratee: (value: T[keyof T], key: keyof T) => boolean | void
): T {
  for (const key in obj) {
    const shouldContinue = iteratee(obj[key], key);
    if (shouldContinue === false) {
      break;
    }
  }
  return obj;
}

export function forInRight<T extends object>(
  obj: T,
  iteratee: (value: T[keyof T], key: keyof T) => boolean | void
): T {
  const allKeys = Object.keys(obj);
  for (let i = allKeys.length - 1; i >= 0; i--) {
    const key = allKeys[i] as keyof T;
    const shouldContinue = iteratee(obj[key], key);
    if (shouldContinue === false) {
      break;
    }
  }
  return obj;
}

export function forOwn<T extends object>(
  obj: T,
  iteratee: (value: T[keyof T], key: keyof T) => boolean | void
): T {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const shouldContinue = iteratee(obj[key], key);
      if (shouldContinue === false) {
        break;
      }
    }
  }
  return obj;
}

export function forOwnRight<T extends object>(
  obj: T,
  iteratee: (value: T[keyof T], key: keyof T) => boolean | void
): T {
  const ownKeys = Object.keys(obj);
  for (let i = ownKeys.length - 1; i >= 0; i--) {
    const key = ownKeys[i] as keyof T;
    const shouldContinue = iteratee(obj[key], key);
    if (shouldContinue === false) {
      break;
    }
  }
  return obj;
}
