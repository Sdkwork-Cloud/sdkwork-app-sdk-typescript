export type Primitive = string | number | boolean | null | undefined;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Map) {
    const cloned = new Map();
    obj.forEach((value, key) => {
      cloned.set(deepClone(key), deepClone(value));
    });
    return cloned as unknown as T;
  }

  if (obj instanceof Set) {
    const cloned = new Set();
    obj.forEach((value) => {
      cloned.add(deepClone(value));
    });
    return cloned as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }

  if (ArrayBuffer.isView(obj)) {
    const buffer = obj.buffer instanceof SharedArrayBuffer 
      ? obj.buffer 
      : obj.buffer.slice(0);
    return new (obj.constructor as new (buffer: ArrayBuffer | SharedArrayBuffer) => typeof obj)(
      buffer
    ) as unknown as T;
  }

  const cloned = Object.create(Object.getPrototypeOf(obj));
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();

  if (source === undefined) return target;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        );
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) =>
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  );
}

export function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
  separator = '.'
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;
    const value = obj[key];

    if (isObject(value) && Object.keys(value).length > 0) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey, separator));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

export function unflattenObject(
  obj: Record<string, unknown>,
  separator = '.'
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    const parts = key.split(separator);
    let current: Record<string, unknown> = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part !== undefined && !(part in current)) {
        current[part] = {};
      }
      if (part !== undefined) {
        current = current[part] as Record<string, unknown>;
      }
    }

    const lastPart = parts[parts.length - 1];
    if (lastPart !== undefined) {
      current[lastPart] = obj[key];
    }
  }

  return result;
}

export function serialize(obj: unknown): string {
  return JSON.stringify(obj, (_, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    if (value instanceof Map) {
      return { __type: 'Map', value: Array.from(value.entries()) };
    }
    if (value instanceof Set) {
      return { __type: 'Set', value: Array.from(value) };
    }
    if (value instanceof RegExp) {
      return { __type: 'RegExp', value: value.source, flags: value.flags };
    }
    if (typeof value === 'bigint') {
      return { __type: 'BigInt', value: value.toString() };
    }
    return value;
  });
}

export function deserialize<T>(str: string): T {
  return JSON.parse(str, (_, value) => {
    if (value && typeof value === 'object' && '__type' in value) {
      switch (value.__type) {
        case 'Date':
          return new Date(value.value);
        case 'Map':
          return new Map(value.value);
        case 'Set':
          return new Set(value.value);
        case 'RegExp':
          return new RegExp(value.value, value.flags);
        case 'BigInt':
          return BigInt(value.value);
      }
    }
    return value;
  });
}

export function toCamelCase(str: string): string {
  return str.replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function transformKeys<T extends Record<string, unknown>>(
  obj: T,
  transformer: (key: string) => string
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = transformer(key);

    if (isObject(value)) {
      result[newKey] = transformKeys(value as Record<string, unknown>, transformer);
    } else if (Array.isArray(value)) {
      result[newKey] = value.map((item) =>
        isObject(item) ? transformKeys(item as Record<string, unknown>, transformer) : item
      );
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

export function toCamelCaseKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return transformKeys(obj, toCamelCase);
}

export function toSnakeCaseKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return transformKeys(obj, toSnakeCase);
}

export function pickBy<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: unknown, key: string) => boolean
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function omitBy<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: unknown, key: string) => boolean
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (!predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function mapValues<T extends Record<string, unknown>, R>(
  obj: T,
  mapper: (value: T[keyof T], key: string) => R
): Record<string, R> {
  const result: Record<string, R> = {};

  for (const key in obj) {
    result[key] = mapper(obj[key], key);
  }

  return result;
}

export function mapKeys<T extends Record<string, unknown>>(
  obj: T,
  mapper: (key: string, value: T[keyof T]) => string
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};

  for (const key in obj) {
    result[mapper(key, obj[key])] = obj[key];
  }

  return result;
}
