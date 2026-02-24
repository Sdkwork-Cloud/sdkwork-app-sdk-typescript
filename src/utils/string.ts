export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function lowerFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function upperFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase());
}

export function pascalCase(str: string): string {
  return upperFirst(camelCase(str));
}

export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

export function constantCase(str: string): string {
  return snakeCase(str).toUpperCase();
}

export function dotCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .replace(/[-_\s]+/g, '.')
    .toLowerCase();
}

export function pathCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1/$2')
    .replace(/[-_\s]+/g, '/')
    .toLowerCase();
}

export function sentenceCase(str: string): string {
  return str
    .replace(/[-_\s]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

export function titleCase(str: string): string {
  const minorWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
  
  return str
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !minorWords.includes(word)) {
        return capitalize(word);
      }
      return word;
    })
    .join(' ');
}

export function truncate(str: string, length: number, omission: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - omission.length) + omission;
}

export function truncateMiddle(str: string, length: number, omission: string = '...'): string {
  if (str.length <= length) return str;
  const start = Math.ceil((length - omission.length) / 2);
  const end = Math.floor((length - omission.length) / 2);
  return str.slice(0, start) + omission + str.slice(-end);
}

export function pad(str: string, length: number, chars: string = ' '): string {
  const padLength = Math.max(length - str.length, 0);
  const padLeft = Math.floor(padLength / 2);
  const padRight = padLength - padLeft;
  
  return (
    chars.repeat(Math.ceil(padLeft / chars.length)).slice(0, padLeft) +
    str +
    chars.repeat(Math.ceil(padRight / chars.length)).slice(0, padRight)
  );
}

export function padLeft(str: string, length: number, chars: string = ' '): string {
  const padLength = Math.max(length - str.length, 0);
  return chars.repeat(Math.ceil(padLength / chars.length)).slice(0, padLength) + str;
}

export function padRight(str: string, length: number, chars: string = ' '): string {
  const padLength = Math.max(length - str.length, 0);
  return str + chars.repeat(Math.ceil(padLength / chars.length)).slice(0, padLength);
}

export function repeat(str: string, n: number, separator: string = ''): string {
  if (n <= 0) return '';
  if (n === 1) return str;
  return Array(n).fill(str).join(separator);
}

export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

export function escape(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
  };
  
  return str.replace(/[&<>"'`]/g, (char) => escapeMap[char] ?? char);
}

export function unescape(str: string): string {
  const unescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`',
  };
  
  return str.replace(/&(?:amp|lt|gt|quot|#39|#96);/g, (entity) => unescapeMap[entity] ?? entity);
}

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function trim(str: string, chars?: string): string {
  if (!chars) return str.trim();
  const pattern = new RegExp(`^[${escapeRegExp(chars)}]+|[${escapeRegExp(chars)}]+$`, 'g');
  return str.replace(pattern, '');
}

export function trimLeft(str: string, chars?: string): string {
  if (!chars) return str.trimStart();
  const pattern = new RegExp(`^[${escapeRegExp(chars)}]+`, 'g');
  return str.replace(pattern, '');
}

export function trimRight(str: string, chars?: string): string {
  if (!chars) return str.trimEnd();
  const pattern = new RegExp(`[${escapeRegExp(chars)}]+$`, 'g');
  return str.replace(pattern, '');
}

export function words(str: string, pattern?: string | RegExp): string[] {
  const regex = pattern instanceof RegExp ? pattern : /\b\w+\b/g;
  return str.match(regex) ?? [];
}

export function split(str: string, separator: string | RegExp, limit?: number): string[] {
  return str.split(separator, limit);
}

export function join(strings: string[], separator: string = ''): string {
  return strings.join(separator);
}

export function startsWith(str: string, prefix: string, position: number = 0): boolean {
  return str.slice(position, position + prefix.length) === prefix;
}

export function endsWith(str: string, suffix: string, position: number = str.length): boolean {
  const end = position - suffix.length;
  return end >= 0 && str.slice(end, position) === suffix;
}

export function includes(str: string, search: string, position: number = 0): boolean {
  return str.indexOf(search, position) !== -1;
}

export function count(str: string, search: string): number {
  if (!search) return 0;
  let count = 0;
  let pos = str.indexOf(search);
  while (pos !== -1) {
    count++;
    pos = str.indexOf(search, pos + search.length);
  }
  return count;
}

export function replaceAll(str: string, search: string | RegExp, replace: string): string {
  if (typeof search === 'string') {
    return str.split(search).join(replace);
  }
  return str.replace(new RegExp(search.source, `${search.flags}g`), replace);
}

export function template(str: string, data: Record<string, unknown>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ''));
}

export function templateWith(str: string, data: Record<string, unknown>, pattern: RegExp = /\{\{(\w+)\}\}/g): string {
  return str.replace(pattern, (_, key) => String(data[key] ?? ''));
}

export function sprintf(format: string, ...args: unknown[]): string {
  let i = 0;
  return format.replace(/%([%sdifboxXeEgG])/g, (_, spec) => {
    if (spec === '%') return '%';
    const arg = args[i++];
    switch (spec) {
      case 's': return String(arg);
      case 'd':
      case 'i': return String(Math.floor(Number(arg)));
      case 'f': return String(Number(arg));
      case 'b': return Number(arg).toString(2);
      case 'o': return Number(arg).toString(8);
      case 'x': return Number(arg).toString(16);
      case 'X': return Number(arg).toString(16).toUpperCase();
      case 'e': return Number(arg).toExponential();
      case 'E': return Number(arg).toExponential().toUpperCase();
      case 'g': return Number(arg).toPrecision();
      case 'G': return Number(arg).toPrecision().toUpperCase();
      default: return '';
    }
  });
}

export function wordWrap(str: string, width: number = 80, breakChar: string = '\n'): string {
  const words = str.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join(breakChar);
}

export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

export function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

export function isLowerCase(str: string): boolean {
  return str === str.toLowerCase();
}

export function isUpperCase(str: string): boolean {
  return str === str.toUpperCase();
}

export function isBlank(str: string): boolean {
  return str.trim().length === 0;
}

export function isNotBlank(str: string): boolean {
  return str.trim().length > 0;
}

export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function stripScripts(str: string): string {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function stripComments(str: string): string {
  return str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[-_\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function unslugify(str: string): string {
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function mask(str: string, maskChar: string = '*', start: number = 0, end: number = str.length): string {
  if (start >= end || start >= str.length) return str;
  const actualEnd = Math.min(end, str.length);
  return (
    str.slice(0, start) +
    maskChar.repeat(actualEnd - start) +
    str.slice(actualEnd)
  );
}

export function maskEmail(email: string, maskChar: string = '*'): string {
  const [localPart, domain] = email.split('@');
  if (!domain || !localPart) return email;
  
  const maskedLocal = localPart.length > 2
    ? (localPart[0] ?? '') + maskChar.repeat(localPart.length - 2) + (localPart[localPart.length - 1] ?? '')
    : localPart;
  
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string, maskChar: string = '*'): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return phone;
  
  const visible = digits.slice(-4);
  const masked = maskChar.repeat(digits.length - 4);
  return masked + visible;
}

export function maskCreditCard(cardNumber: string, maskChar: string = '*'): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 8) return cardNumber;
  
  const first = digits.slice(0, 4);
  const last = digits.slice(-4);
  const middle = maskChar.repeat(digits.length - 8);
  
  return `${first}${middle}${last}`;
}
