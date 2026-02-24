export function first<T>(array: T[]): T | undefined {
  return array[0];
}

export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

export function nth<T>(array: T[], n: number): T | undefined {
  const index = n < 0 ? array.length + n : n;
  return array[index];
}

export function take<T>(array: T[], n: number): T[] {
  return array.slice(0, n);
}

export function takeRight<T>(array: T[], n: number): T[] {
  return n === 0 ? [] : array.slice(-n);
}

export function takeWhile<T>(array: T[], predicate: (value: T) => boolean): T[] {
  const result: T[] = [];
  for (const item of array) {
    if (!predicate(item)) break;
    result.push(item);
  }
  return result;
}

export function drop<T>(array: T[], n: number): T[] {
  return array.slice(n);
}

export function dropRight<T>(array: T[], n: number): T[] {
  return n === 0 ? [...array] : array.slice(0, -n);
}

export function dropWhile<T>(array: T[], predicate: (value: T) => boolean): T[] {
  let i = 0;
  while (i < array.length && predicate(array[i]!)) {
    i++;
  }
  return array.slice(i);
}

export function initial<T>(array: T[]): T[] {
  return array.slice(0, -1);
}

export function tail<T>(array: T[]): T[] {
  return array.slice(1);
}

export function head<T>(array: T[]): T | undefined {
  return array[0];
}

export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[];
}

export function flattenDeep<T>(array: unknown[]): T[] {
  const result: T[] = [];
  const stack = [...array];

  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item as T);
    }
  }

  return result.reverse();
}

export function flattenDepth<T>(array: unknown[], depth: number = 1): T[] {
  if (depth === 0) return array as T[];
  return (array as unknown[]).reduce<T[]>((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flattenDepth<T>(item, depth - 1));
    } else {
      acc.push(item as T);
    }
    return acc;
  }, []);
}

export function difference<T>(array: T[], ...values: T[][]): T[] {
  const exclude = new Set(values.flat());
  return array.filter((item) => !exclude.has(item));
}

export function differenceBy<T>(
  array: T[],
  values: T[],
  iteratee: (value: T) => unknown
): T[] {
  const exclude = new Set(values.map(iteratee));
  return array.filter((item) => !exclude.has(iteratee(item)));
}

export function differenceWith<T>(
  array: T[],
  values: T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  return array.filter((item) => !values.some((value) => comparator(item, value)));
}

export function intersection<T>(...arrays: T[][]): T[] {
  const [first = [], ...rest] = arrays;
  return first.filter((item) => rest.every((arr) => arr.includes(item)));
}

export function intersectionBy<T>(
  arrays: T[][],
  iteratee: (value: T) => unknown
): T[] {
  const [first = [], ...rest] = arrays;
  const sets = rest.map((arr) => new Set(arr.map(iteratee)));
  return first.filter((item) => sets.every((set) => set.has(iteratee(item))));
}

export function intersectionWith<T>(
  arrays: T[][],
  comparator: (a: T, b: T) => boolean
): T[] {
  const [first = [], ...rest] = arrays;
  return first.filter((item) =>
    rest.every((arr) => arr.some((value) => comparator(item, value)))
  );
}

export function union<T>(...arrays: T[][]): T[] {
  return [...new Set(arrays.flat())];
}

export function unionBy<T>(arrays: T[][], iteratee: (value: T) => unknown): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const arr of arrays) {
    for (const item of arr) {
      const key = iteratee(item);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
  }

  return result;
}

export function unionWith<T>(
  arrays: T[][],
  comparator: (a: T, b: T) => boolean
): T[] {
  const result: T[] = [];

  for (const arr of arrays) {
    for (const item of arr) {
      if (!result.some((existing) => comparator(existing, item))) {
        result.push(item);
      }
    }
  }

  return result;
}

export function xor<T>(...arrays: T[][]): T[] {
  const counts = new Map<T, number>();

  for (const arr of arrays) {
    for (const item of arr) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count === 1)
    .map(([item]) => item);
}

export function zip<T, U>(array1: T[], array2: U[]): Array<[T, U]> {
  const length = Math.min(array1.length, array2.length);
  const result: Array<[T, U]> = [];

  for (let i = 0; i < length; i++) {
    result.push([array1[i]!, array2[i]!]);
  }

  return result;
}

export function zipWith<T, U, R>(
  array1: T[],
  array2: U[],
  fn: (a: T, b: U) => R
): R[] {
  const length = Math.min(array1.length, array2.length);
  const result: R[] = [];

  for (let i = 0; i < length; i++) {
    result.push(fn(array1[i]!, array2[i]!));
  }

  return result;
}

export function unzip<T, U>(array: Array<[T, U]>): [T[], U[]] {
  const result1: T[] = [];
  const result2: U[] = [];

  for (const [a, b] of array) {
    result1.push(a);
    result2.push(b);
  }

  return [result1, result2];
}

export function unzipWith<T, R>(
  array: T[][],
  fn: (...values: T[]) => R
): R[] {
  const maxLength = Math.max(...array.map((arr) => arr.length));
  const result: R[] = [];

  for (let i = 0; i < maxLength; i++) {
    const values = array.map((arr) => arr[i]).filter((v) => v !== undefined);
    result.push(fn(...values));
  }

  return result;
}

export function partition<T>(array: T[], predicate: (value: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];

  for (const item of array) {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  }

  return [pass, fail];
}

export function countBy<T>(array: T[], iteratee: (value: T) => string): Record<string, number> {
  const result: Record<string, number> = {};

  for (const item of array) {
    const key = iteratee(item);
    result[key] = (result[key] ?? 0) + 1;
  }

  return result;
}

export function keyBy<T>(
  array: T[],
  iteratee: (value: T) => string
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const item of array) {
    result[iteratee(item)] = item;
  }

  return result;
}

export function sample<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

export function sampleSize<T>(array: T[], n: number): T[] {
  const result = [...array];
  const length = Math.min(n, result.length);

  for (let i = 0; i < length; i++) {
    const randomIndex = i + Math.floor(Math.random() * (result.length - i));
    const temp = result[i];
    result[i] = result[randomIndex]!;
    result[randomIndex] = temp!;
  }

  return result.slice(0, length);
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[randomIndex]!;
    result[randomIndex] = temp!;
  }

  return result;
}

export function reverse<T>(array: T[]): T[] {
  return [...array].reverse();
}

export function fill<T>(array: T[], value: T, start: number = 0, end?: number): T[] {
  const result = [...array];
  const endIndex = end ?? result.length;

  for (let i = start; i < endIndex; i++) {
    result[i] = value;
  }

  return result;
}

export function pull<T>(array: T[], ...values: T[]): T[] {
  const exclude = new Set(values);
  return array.filter((item) => !exclude.has(item));
}

export function pullAll<T>(array: T[], values: T[]): T[] {
  const exclude = new Set(values);
  return array.filter((item) => !exclude.has(item));
}

export function pullAt<T>(array: T[], indexes: number[]): T[] {
  const sortedIndexes = [...indexes].sort((a, b) => b - a);
  const result = [...array];

  for (const index of sortedIndexes) {
    result.splice(index, 1);
  }

  return result;
}

export function remove<T>(array: T[], predicate: (value: T) => boolean): T[] {
  return array.filter((item) => !predicate(item));
}

export function insert<T>(array: T[], index: number, ...items: T[]): T[] {
  const result = [...array];
  result.splice(index, 0, ...items);
  return result;
}

export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [item] = result.splice(fromIndex, 1);
  if (item !== undefined) {
    result.splice(toIndex, 0, item);
  }
  return result;
}

export function rotate<T>(array: T[], n: number): T[] {
  const length = array.length;
  const offset = ((n % length) + length) % length;
  return [...array.slice(offset), ...array.slice(0, offset)];
}

export function findIndex<T>(array: T[], predicate: (value: T, index: number) => boolean): number {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i]!, i)) {
      return i;
    }
  }
  return -1;
}

export function findLastIndex<T>(array: T[], predicate: (value: T, index: number) => boolean): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i]!, i)) {
      return i;
    }
  }
  return -1;
}

export function indexOf<T>(array: T[], value: T, fromIndex: number = 0): number {
  return array.indexOf(value, fromIndex);
}

export function lastIndexOf<T>(array: T[], value: T, fromIndex?: number): number {
  return array.lastIndexOf(value, fromIndex ?? array.length - 1);
}

export function sortedIndex<T>(array: T[], value: T): number {
  let low = 0;
  let high = array.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if ((array[mid] as T) < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

export function sortedIndexBy<T>(
  array: T[],
  value: T,
  iteratee: (value: T) => number
): number {
  const valueKey = iteratee(value);
  let low = 0;
  let high = array.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]!) < valueKey) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

export function sortedIndexOf<T>(array: T[], value: T): number {
  const index = sortedIndex(array, value);
  return array[index] === value ? index : -1;
}

export function sortedLastIndex<T>(array: T[], value: T): number {
  let low = 0;
  let high = array.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if ((array[mid] as T) <= value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

export function sortedUniq<T>(array: T[]): T[] {
  const result: T[] = [];
  let prev: T | undefined;

  for (const item of array) {
    if (item !== prev) {
      result.push(item);
      prev = item;
    }
  }

  return result;
}

export function sortedUniqBy<T>(array: T[], iteratee: (value: T) => unknown): T[] {
  const result: T[] = [];
  let prevKey: unknown;

  for (const item of array) {
    const key = iteratee(item);
    if (key !== prevKey) {
      result.push(item);
      prevKey = key;
    }
  }

  return result;
}
