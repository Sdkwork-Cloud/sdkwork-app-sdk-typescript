export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface DateParts {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const TIME_UNITS: Record<TimeUnit, number> = {
  millisecond: 1,
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  quarter: 90 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

export function createDate(date?: Date | string | number): Date {
  if (date === undefined) return new Date();
  if (date instanceof Date) return new Date(date);
  if (typeof date === 'string') return new Date(date);
  return new Date(date);
}

export function formatDate(date: Date | string | number, format: string, locale?: string): string {
  const d = createDate(date);

  const tokens: Record<string, () => string> = {
    YYYY: () => d.getFullYear().toString(),
    YY: () => d.getFullYear().toString().slice(-2),
    MM: () => (d.getMonth() + 1).toString().padStart(2, '0'),
    M: () => (d.getMonth() + 1).toString(),
    DD: () => d.getDate().toString().padStart(2, '0'),
    D: () => d.getDate().toString(),
    HH: () => d.getHours().toString().padStart(2, '0'),
    H: () => d.getHours().toString(),
    hh: () => (d.getHours() % 12 || 12).toString().padStart(2, '0'),
    h: () => (d.getHours() % 12 || 12).toString(),
    mm: () => d.getMinutes().toString().padStart(2, '0'),
    m: () => d.getMinutes().toString(),
    ss: () => d.getSeconds().toString().padStart(2, '0'),
    s: () => d.getSeconds().toString(),
    SSS: () => d.getMilliseconds().toString().padStart(3, '0'),
    A: () => (d.getHours() >= 12 ? 'PM' : 'AM'),
    a: () => (d.getHours() >= 12 ? 'pm' : 'am'),
    dddd: () => d.toLocaleDateString(locale, { weekday: 'long' }),
    ddd: () => d.toLocaleDateString(locale, { weekday: 'short' }),
    MMMM: () => d.toLocaleDateString(locale, { month: 'long' }),
    MMM: () => d.toLocaleDateString(locale, { month: 'short' }),
  };

  let result = format;
  const sortedKeys = Object.keys(tokens).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const token = tokens[key];
    if (token) {
      result = result.replace(new RegExp(key, 'g'), token());
    }
  }

  return result;
}

export function parseDate(dateString: string, format: string): Date {
  const tokens: Record<string, (d: Date, value: string) => void> = {
    YYYY: (d, v) => d.setFullYear(parseInt(v, 10)),
    YY: (d, v) => d.setFullYear(2000 + parseInt(v, 10)),
    MM: (d, v) => d.setMonth(parseInt(v, 10) - 1),
    M: (d, v) => d.setMonth(parseInt(v, 10) - 1),
    DD: (d, v) => d.setDate(parseInt(v, 10)),
    D: (d, v) => d.setDate(parseInt(v, 10)),
    HH: (d, v) => d.setHours(parseInt(v, 10)),
    H: (d, v) => d.setHours(parseInt(v, 10)),
    mm: (d, v) => d.setMinutes(parseInt(v, 10)),
    m: (d, v) => d.setMinutes(parseInt(v, 10)),
    ss: (d, v) => d.setSeconds(parseInt(v, 10)),
    s: (d, v) => d.setSeconds(parseInt(v, 10)),
    SSS: (d, v) => d.setMilliseconds(parseInt(v, 10)),
  };

  const result = new Date(0);
  let remainingFormat = format;
  let remainingString = dateString;

  const sortedKeys = Object.keys(tokens).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const index = remainingFormat.indexOf(key);
    if (index !== -1) {
      const value = remainingString.substring(index, index + key.length);
      const token = tokens[key];
      if (token) {
        token(result, value);
      }
      remainingFormat = remainingFormat.replace(key, ' '.repeat(key.length));
      remainingString = remainingString.substring(0, index) + ' '.repeat(key.length) + remainingString.substring(index + key.length);
    }
  }

  return result;
}

export function addTime(date: Date | string | number, amount: number, unit: TimeUnit): Date {
  const d = createDate(date);
  const ms = amount * TIME_UNITS[unit];
  return new Date(d.getTime() + ms);
}

export function subtractTime(date: Date | string | number, amount: number, unit: TimeUnit): Date {
  return addTime(date, -amount, unit);
}

export function startOf(date: Date | string | number, unit: TimeUnit): Date {
  const d = createDate(date);

  switch (unit) {
    case 'millisecond':
      return d;
    case 'second':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
    case 'minute':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
    case 'hour':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
    case 'day':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    case 'week': {
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.getFullYear(), d.getMonth(), diff);
    }
    case 'month':
      return new Date(d.getFullYear(), d.getMonth(), 1);
    case 'quarter': {
      const quarter = Math.floor(d.getMonth() / 3);
      return new Date(d.getFullYear(), quarter * 3, 1);
    }
    case 'year':
      return new Date(d.getFullYear(), 0, 1);
    default:
      return d;
  }
}

export function endOf(date: Date | string | number, unit: TimeUnit): Date {
  const d = createDate(date);

  switch (unit) {
    case 'millisecond':
      return d;
    case 'second':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), 999);
    case 'minute':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 59, 999);
    case 'hour':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), 59, 59, 999);
    case 'day':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    case 'week': {
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? 0 : 7);
      return new Date(d.getFullYear(), d.getMonth(), diff, 23, 59, 59, 999);
    }
    case 'month':
      return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    case 'quarter': {
      const quarter = Math.floor(d.getMonth() / 3);
      return new Date(d.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59, 999);
    }
    case 'year':
      return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
    default:
      return d;
  }
}

export function diff(date1: Date | string | number, date2: Date | string | number, unit: TimeUnit): number {
  const d1 = createDate(date1);
  const d2 = createDate(date2);
  const ms = d1.getTime() - d2.getTime();
  return Math.round(ms / TIME_UNITS[unit]);
}

export function isBefore(date1: Date | string | number, date2: Date | string | number): boolean {
  return createDate(date1).getTime() < createDate(date2).getTime();
}

export function isAfter(date1: Date | string | number, date2: Date | string | number): boolean {
  return createDate(date1).getTime() > createDate(date2).getTime();
}

export function isSame(date1: Date | string | number, date2: Date | string | number, unit?: TimeUnit): boolean {
  const d1 = createDate(date1);
  const d2 = createDate(date2);

  if (!unit) {
    return d1.getTime() === d2.getTime();
  }

  return startOf(d1, unit).getTime() === startOf(d2, unit).getTime();
}

export function isBetween(
  date: Date | string | number,
  start: Date | string | number,
  end: Date | string | number,
  inclusivity: '()' | '[]' | '(]' | '[)' = '[]'
): boolean {
  const d = createDate(date).getTime();
  const s = createDate(start).getTime();
  const e = createDate(end).getTime();

  switch (inclusivity) {
    case '()':
      return d > s && d < e;
    case '(]':
      return d > s && d <= e;
    case '[)':
      return d >= s && d < e;
    case '[]':
    default:
      return d >= s && d <= e;
  }
}

export function isToday(date: Date | string | number): boolean {
  return isSame(date, new Date(), 'day');
}

export function isYesterday(date: Date | string | number): boolean {
  return isSame(date, subtractTime(new Date(), 1, 'day'), 'day');
}

export function isTomorrow(date: Date | string | number): boolean {
  return isSame(date, addTime(new Date(), 1, 'day'), 'day');
}

export function isWeekend(date: Date | string | number): boolean {
  const d = createDate(date);
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function isWeekday(date: Date | string | number): boolean {
  return !isWeekend(date);
}

export function getAge(birthDate: Date | string | number): number {
  const birth = createDate(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getDaysInMonth(date: Date | string | number): number {
  const d = createDate(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function getQuarter(date: Date | string | number): number {
  const d = createDate(date);
  return Math.floor(d.getMonth() / 3) + 1;
}

export function getWeek(date: Date | string | number): number {
  const d = createDate(date);
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / TIME_UNITS.day;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function getDayOfYear(date: Date | string | number): number {
  const d = createDate(date);
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / TIME_UNITS.day);
}

export function relativeTime(date: Date | string | number, locale: string = 'en'): string {
  const d = createDate(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffWeeks = Math.round(diffDays / 7);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSeconds) < 60) {
    return rtf.format(-diffSeconds, 'second');
  }
  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(-diffMinutes, 'minute');
  }
  if (Math.abs(diffHours) < 24) {
    return rtf.format(-diffHours, 'hour');
  }
  if (Math.abs(diffDays) < 7) {
    return rtf.format(-diffDays, 'day');
  }
  if (Math.abs(diffWeeks) < 4) {
    return rtf.format(-diffWeeks, 'week');
  }
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(-diffMonths, 'month');
  }
  return rtf.format(-diffYears, 'year');
}

export function getDateParts(date: Date | string | number): DateParts {
  const d = createDate(date);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: d.getMilliseconds(),
  };
}

export function setDateParts(date: Date | string | number, parts: Partial<DateParts>): Date {
  const d = createDate(date);

  if (parts.year !== undefined) d.setFullYear(parts.year);
  if (parts.month !== undefined) d.setMonth(parts.month - 1);
  if (parts.day !== undefined) d.setDate(parts.day);
  if (parts.hours !== undefined) d.setHours(parts.hours);
  if (parts.minutes !== undefined) d.setMinutes(parts.minutes);
  if (parts.seconds !== undefined) d.setSeconds(parts.seconds);
  if (parts.milliseconds !== undefined) d.setMilliseconds(parts.milliseconds);

  return d;
}
