export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isArrayLike(value: unknown): value is ArrayLike<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'length' in value &&
    typeof (value as { length: unknown }).length === 'number' &&
    (value as { length: number }).length >= 0
  );
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

export function isAsyncFunction(value: unknown): value is (...args: unknown[]) => Promise<unknown> {
  return typeof value === 'function' && value.constructor.name === 'AsyncFunction';
}

export function isGeneratorFunction(value: unknown): value is GeneratorFunction {
  return typeof value === 'function' && value.constructor.name === 'GeneratorFunction';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
  return value instanceof WeakMap;
}

export function isWeakSet(value: unknown): value is WeakSet<object> {
  return value instanceof WeakSet;
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise || (isObject(value) && isFunction((value as Record<string, unknown>).then));
}

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return isObject(value) && isFunction((value as Record<string, unknown>).then);
}

export function isIterable(value: unknown): value is Iterable<unknown> {
  return isObject(value) && Symbol.iterator in value;
}

export function isAsyncIterable(value: unknown): value is AsyncIterable<unknown> {
  return isObject(value) && Symbol.asyncIterator in value;
}

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}

export function isDataView(value: unknown): value is DataView {
  return value instanceof DataView;
}

export function isTypedArray(value: unknown): value is ArrayBufferView {
  return (
    value instanceof Int8Array ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Int16Array ||
    value instanceof Uint16Array ||
    value instanceof Int32Array ||
    value instanceof Uint32Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof BigInt64Array ||
    value instanceof BigUint64Array
  );
}

export function isBuffer(value: unknown): value is Buffer {
  return (
    typeof Buffer !== 'undefined' &&
    Buffer.isBuffer(value)
  );
}

export function isBlob(value: unknown): value is Blob {
  return value instanceof Blob;
}

export function isFile(value: unknown): value is File {
  return value instanceof File;
}

export function isFormData(value: unknown): value is FormData {
  return value instanceof FormData;
}

export function isURLInstance(value: unknown): value is URL {
  return value instanceof URL;
}

export function isURLSearchParams(value: unknown): value is URLSearchParams {
  return value instanceof URLSearchParams;
}

export function isEmpty(value: unknown): boolean {
  if (isNil(value)) return true;
  if (isString(value)) return value.length === 0;
  if (isArray(value)) return value.length === 0;
  if (isMap(value) || isSet(value)) return value.size === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}

export function isBlank(value: unknown): boolean {
  if (isNil(value)) return true;
  if (isString(value)) return value.trim().length === 0;
  return false;
}

export function isNotBlank(value: unknown): boolean {
  return !isBlank(value);
}

export function isPrimitive(value: unknown): value is string | number | boolean | null | undefined | symbol | bigint {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

export function isConstructor(value: unknown): value is new (...args: unknown[]) => unknown {
  return isFunction(value) && value.prototype !== undefined;
}

export function isInstanceOf<T>(value: unknown, constructor: new (...args: unknown[]) => T): value is T {
  return value instanceof constructor;
}

export function isTypeOf(value: unknown, type: string): boolean {
  return typeof value === type;
}

export function hasProperty<K extends PropertyKey>(value: unknown, key: K): value is Record<K, unknown> {
  return isObject(value) && key in value;
}

export function hasMethod<K extends PropertyKey>(value: unknown, key: K): value is Record<K, (...args: unknown[]) => unknown> {
  return hasProperty(value, key) && isFunction(value[key]);
}

export function hasOwn<K extends PropertyKey>(value: unknown, key: K): value is Record<K, unknown> {
  return isObject(value) && Object.prototype.hasOwnProperty.call(value, key);
}

export function isEqual(value: unknown, other: unknown): boolean {
  return Object.is(value, other);
}

export function isStrictEqual(value: unknown, other: unknown): boolean {
  return value === other;
}

export function isDeepEqual(value: unknown, other: unknown): boolean {
  if (isEqual(value, other)) return true;

  if (typeof value !== typeof other) return false;

  if (isNil(value) || isNil(other)) return false;

  if (typeof value !== 'object') return false;

  if (isArray(value) !== isArray(other)) return false;

  if (isArray(value) && isArray(other)) {
    if (value.length !== other.length) return false;
    return value.every((item, index) => isDeepEqual(item, other[index]));
  }

  if (isDate(value) && isDate(other)) {
    return value.getTime() === other.getTime();
  }

  if (isRegExp(value) && isRegExp(other)) {
    return value.source === other.source && value.flags === other.flags;
  }

  if (isMap(value) && isMap(other)) {
    if (value.size !== other.size) return false;
    for (const [key, val] of value) {
      if (!other.has(key) || !isDeepEqual(val, other.get(key))) {
        return false;
      }
    }
    return true;
  }

  if (isSet(value) && isSet(other)) {
    if (value.size !== other.size) return false;
    for (const item of value) {
      if (!other.has(item)) return false;
    }
    return true;
  }

  const keys1 = Object.keys(value as object);
  const keys2 = Object.keys(other as object);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) =>
    isDeepEqual(
      (value as Record<string, unknown>)[key],
      (other as Record<string, unknown>)[key]
    )
  );
}

export function isJSON(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function parseJSON<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function safeParseJSON<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function isNumeric(value: unknown): boolean {
  if (isNumber(value)) return true;
  if (isString(value)) {
    return !isNaN(Number(value)) && isFinite(Number(value));
  }
  return false;
}

export function isInteger(value: unknown): boolean {
  return Number.isInteger(value);
}

export function isFloat(value: unknown): boolean {
  return isNumber(value) && !Number.isInteger(value);
}

export function isPositive(value: number): boolean {
  return value > 0;
}

export function isNegative(value: number): boolean {
  return value < 0;
}

export function isZero(value: number): boolean {
  return value === 0;
}

export function isFinite(value: unknown): boolean {
  return Number.isFinite(value);
}

export function isNaN(value: unknown): boolean {
  return Number.isNaN(value);
}

export function isInfinite(value: unknown): boolean {
  return isNumber(value) && !Number.isFinite(value);
}

export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function isURL(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isIPv4(value: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(value)) return false;
  return value.split('.').every((part) => parseInt(part, 10) <= 255);
}

export function isIPv6(value: string): boolean {
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(value);
}

export function isUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function isHex(value: string): boolean {
  return /^[0-9a-fA-F]+$/.test(value);
}

export function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function isBase64(value: string): boolean {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(value) && value.length % 4 === 0;
}

export function isPhoneNumber(value: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(value.replace(/[\s-]/g, ''));
}

export function isCreditCard(value: string): boolean {
  const sanitized = value.replace(/\D/g, '');
  if (sanitized.length < 13 || sanitized.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    const char = sanitized[i];
    if (!char) continue;
    let digit = parseInt(char, 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function assert<T>(value: unknown, predicate: (value: unknown) => value is T, message?: string): asserts value is T {
  if (!predicate(value)) {
    throw new TypeError(message ?? 'Assertion failed');
  }
}

export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (!isDefined(value)) {
    throw new TypeError(message ?? 'Value is null or undefined');
  }
}

export function assertString(value: unknown, message?: string): asserts value is string {
  if (!isString(value)) {
    throw new TypeError(message ?? 'Value is not a string');
  }
}

export function assertNumber(value: unknown, message?: string): asserts value is number {
  if (!isNumber(value)) {
    throw new TypeError(message ?? 'Value is not a number');
  }
}

export function assertBoolean(value: unknown, message?: string): asserts value is boolean {
  if (!isBoolean(value)) {
    throw new TypeError(message ?? 'Value is not a boolean');
  }
}

export function assertObject(value: unknown, message?: string): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new TypeError(message ?? 'Value is not an object');
  }
}

export function assertArray(value: unknown, message?: string): asserts value is unknown[] {
  if (!isArray(value)) {
    throw new TypeError(message ?? 'Value is not an array');
  }
}

export function assertFunction(value: unknown, message?: string): asserts value is (...args: unknown[]) => unknown {
  if (!isFunction(value)) {
    throw new TypeError(message ?? 'Value is not a function');
  }
}

export function assertNever(value: never): never {
  throw new TypeError(`Unexpected value: ${value}`);
}
