export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function inRange(value: number, start: number, end?: number): boolean {
  const actualEnd = end ?? start;
  const actualStart = end !== undefined ? start : 0;
  return value >= Math.min(actualStart, actualEnd) && value < Math.max(actualStart, actualEnd);
}

export function random(min: number, max: number, floating: boolean = false): number {
  if (floating) {
    return Math.random() * (max - min) + min;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function round(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export function floor(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.floor(value * factor) / factor;
}

export function ceil(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.ceil(value * factor) / factor;
}

export function truncate(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.trunc(value * factor) / factor;
}

export function sum(...values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

export function sumBy<T>(array: T[], iteratee: (value: T) => number): number {
  return array.reduce((acc, item) => acc + iteratee(item), 0);
}

export function mean(...values: number[]): number {
  if (values.length === 0) return 0;
  return sum(...values) / values.length;
}

export function meanBy<T>(array: T[], iteratee: (value: T) => number): number {
  if (array.length === 0) return 0;
  return sumBy(array, iteratee) / array.length;
}

export function median(...values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 
    ? (sorted[mid] ?? 0) 
    : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
}

export function mode(...values: number[]): number[] {
  const counts = new Map<number, number>();
  let maxCount = 0;

  for (const value of values) {
    const count = (counts.get(value) ?? 0) + 1;
    counts.set(value, count);
    maxCount = Math.max(maxCount, count);
  }

  const result: number[] = [];
  counts.forEach((count, value) => {
    if (count === maxCount) {
      result.push(value);
    }
  });

  return result;
}

export function variance(...values: number[]): number {
  if (values.length === 0) return 0;
  const avg = mean(...values);
  return values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
}

export function standardDeviation(...values: number[]): number {
  return Math.sqrt(variance(...values));
}

export function min(...values: number[]): number {
  return Math.min(...values);
}

export function minBy<T>(array: T[], iteratee: (value: T) => number): T | undefined {
  if (array.length === 0) return undefined;
  let minItem = array[0]!;
  let minValue = iteratee(minItem);

  for (let i = 1; i < array.length; i++) {
    const item = array[i]!;
    const value = iteratee(item);
    if (value < minValue) {
      minValue = value;
      minItem = item;
    }
  }

  return minItem;
}

export function max(...values: number[]): number {
  return Math.max(...values);
}

export function maxBy<T>(array: T[], iteratee: (value: T) => number): T | undefined {
  if (array.length === 0) return undefined;
  let maxItem = array[0]!;
  let maxValue = iteratee(maxItem);

  for (let i = 1; i < array.length; i++) {
    const item = array[i]!;
    const value = iteratee(item);
    if (value > maxValue) {
      maxValue = value;
      maxItem = item;
    }
  }

  return maxItem;
}

export function range(start: number, end?: number, step: number = 1): number[] {
  const actualEnd = end ?? start;
  const actualStart = end !== undefined ? start : 0;
  const result: number[] = [];

  if (step === 0) return result;

  if (step > 0) {
    for (let i = actualStart; i < actualEnd; i += step) {
      result.push(i);
    }
  } else {
    for (let i = actualStart; i > actualEnd; i += step) {
      result.push(i);
    }
  }

  return result;
}

export function isFinite(value: unknown): value is number {
  return Number.isFinite(value);
}

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

export function isFloat(value: unknown): value is number {
  return typeof value === 'number' && !Number.isInteger(value) && Number.isFinite(value);
}

export function isNaN(value: unknown): boolean {
  return Number.isNaN(value);
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
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

export function isEven(value: number): boolean {
  return value % 2 === 0;
}

export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

export function isPrime(value: number): boolean {
  if (value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;

  const sqrt = Math.sqrt(value);
  for (let i = 3; i <= sqrt; i += 2) {
    if (value % i === 0) return false;
  }

  return true;
}

export function isDivisibleBy(value: number, divisor: number): boolean {
  return value % divisor === 0;
}

export function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function fibonacci(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const result: number[] = [0, 1];
  for (let i = 2; i < n; i++) {
    const prev1 = result[i - 1] ?? 0;
    const prev2 = result[i - 2] ?? 0;
    result.push(prev1 + prev2);
  }
  return result;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function percentage(value: number, total: number, decimals: number = 2): number {
  if (total === 0) return 0;
  return round((value / total) * 100, decimals);
}

export function percentageChange(oldValue: number, newValue: number, decimals: number = 2): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return round(((newValue - oldValue) / oldValue) * 100, decimals);
}

export function ratio(a: number, b: number, _decimals: number = 2): string {
  if (b === 0) return '0:0';
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
}

export function toFixed(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function toPrecision(value: number, precision: number): string {
  return value.toPrecision(precision);
}

export function toExponential(value: number, decimals?: number): string {
  return value.toExponential(decimals);
}

export function toHex(value: number): string {
  return value.toString(16);
}

export function toBinary(value: number): string {
  return value.toString(2);
}

export function toOctal(value: number): string {
  return value.toString(8);
}

export function fromHex(hex: string): number {
  return parseInt(hex, 16);
}

export function fromBinary(binary: string): number {
  return parseInt(binary, 2);
}

export function fromOctal(octal: string): number {
  return parseInt(octal, 8);
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function inverseLerp(start: number, end: number, value: number): number {
  if (start === end) return 0;
  return (value - start) / (end - start);
}

export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return lerp(outMin, outMax, inverseLerp(inMin, inMax, value));
}

export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function approximately(a: number, b: number, epsilon: number = 1e-9): boolean {
  return Math.abs(a - b) < epsilon;
}

export function sign(value: number): number {
  return Math.sign(value);
}

export function abs(value: number): number {
  return Math.abs(value);
}

export function negate(value: number): number {
  return -value;
}

export function square(value: number): number {
  return value * value;
}

export function cube(value: number): number {
  return value * value * value;
}

export function sqrt(value: number): number {
  return Math.sqrt(value);
}

export function cbrt(value: number): number {
  return Math.cbrt(value);
}

export function pow(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

export function exp(value: number): number {
  return Math.exp(value);
}

export function log(value: number): number {
  return Math.log(value);
}

export function log10(value: number): number {
  return Math.log10(value);
}

export function log2(value: number): number {
  return Math.log2(value);
}

export function sin(value: number): number {
  return Math.sin(value);
}

export function cos(value: number): number {
  return Math.cos(value);
}

export function tan(value: number): number {
  return Math.tan(value);
}

export function asin(value: number): number {
  return Math.asin(value);
}

export function acos(value: number): number {
  return Math.acos(value);
}

export function atan(value: number): number {
  return Math.atan(value);
}

export function atan2(y: number, x: number): number {
  return Math.atan2(y, x);
}

export function sinh(value: number): number {
  return Math.sinh(value);
}

export function cosh(value: number): number {
  return Math.cosh(value);
}

export function tanh(value: number): number {
  return Math.tanh(value);
}
