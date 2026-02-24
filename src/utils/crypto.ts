function md5cycle(x: number[], k: number[]): void {
  let a = x[0]!, b = x[1]!, c = x[2]!, d = x[3]!;
  a = ff(a, b, c, d, k[0]!, 7, -680876936);
  d = ff(d, a, b, c, k[1]!, 12, -389564586);
  c = ff(c, d, a, b, k[2]!, 17, 606105819);
  b = ff(b, c, d, a, k[3]!, 22, -1044525330);
  a = ff(a, b, c, d, k[4]!, 7, -176418897);
  d = ff(d, a, b, c, k[5]!, 12, 1200080426);
  c = ff(c, d, a, b, k[6]!, 17, -1473231341);
  b = ff(b, c, d, a, k[7]!, 22, -45705983);
  a = ff(a, b, c, d, k[8]!, 7, 1770035416);
  d = ff(d, a, b, c, k[9]!, 12, -1958414417);
  c = ff(c, d, a, b, k[10]!, 17, -42063);
  b = ff(b, c, d, a, k[11]!, 22, -1990404162);
  a = ff(a, b, c, d, k[12]!, 7, 1804603682);
  d = ff(d, a, b, c, k[13]!, 12, -40341101);
  c = ff(c, d, a, b, k[14]!, 17, -1502002290);
  b = ff(b, c, d, a, k[15]!, 22, 1236535329);
  a = gg(a, b, c, d, k[1]!, 5, -165796510);
  d = gg(d, a, b, c, k[6]!, 9, -1069501632);
  c = gg(c, d, a, b, k[11]!, 14, 643717713);
  b = gg(b, c, d, a, k[0]!, 20, -373897302);
  a = gg(a, b, c, d, k[5]!, 5, -701558691);
  d = gg(d, a, b, c, k[10]!, 9, 38016083);
  c = gg(c, d, a, b, k[15]!, 14, -660478335);
  b = gg(b, c, d, a, k[4]!, 20, -405537848);
  a = gg(a, b, c, d, k[9]!, 5, 568446438);
  d = gg(d, a, b, c, k[14]!, 9, -1019803690);
  c = gg(c, d, a, b, k[3]!, 14, -187363961);
  b = gg(b, c, d, a, k[8]!, 20, 1163531501);
  a = gg(a, b, c, d, k[13]!, 5, -1444681467);
  d = gg(d, a, b, c, k[2]!, 9, -51403784);
  c = gg(c, d, a, b, k[7]!, 14, 1735328473);
  b = gg(b, c, d, a, k[12]!, 20, -1926607734);
  a = hh(a, b, c, d, k[5]!, 4, -378558);
  d = hh(d, a, b, c, k[8]!, 11, -2022574463);
  c = hh(c, d, a, b, k[11]!, 16, 1839030562);
  b = hh(b, c, d, a, k[14]!, 23, -35309556);
  a = hh(a, b, c, d, k[1]!, 4, -1530992060);
  d = hh(d, a, b, c, k[4]!, 11, 1272893353);
  c = hh(c, d, a, b, k[7]!, 16, -155497632);
  b = hh(b, c, d, a, k[10]!, 23, -1094730640);
  a = hh(a, b, c, d, k[13]!, 4, 681279174);
  d = hh(d, a, b, c, k[0]!, 11, -358537222);
  c = hh(c, d, a, b, k[3]!, 16, -722521979);
  b = hh(b, c, d, a, k[6]!, 23, 76029189);
  a = hh(a, b, c, d, k[9]!, 4, -640364487);
  d = hh(d, a, b, c, k[12]!, 11, -421815835);
  c = hh(c, d, a, b, k[15]!, 16, 530742520);
  b = hh(b, c, d, a, k[2]!, 23, -995338651);
  a = ii(a, b, c, d, k[0]!, 6, -198630844);
  d = ii(d, a, b, c, k[7]!, 10, 1126891415);
  c = ii(c, d, a, b, k[14]!, 15, -1416354905);
  b = ii(b, c, d, a, k[5]!, 21, -57434055);
  a = ii(a, b, c, d, k[12]!, 6, 1700485571);
  d = ii(d, a, b, c, k[3]!, 10, -1894986606);
  c = ii(c, d, a, b, k[10]!, 15, -1051523);
  b = ii(b, c, d, a, k[1]!, 21, -2054922799);
  a = ii(a, b, c, d, k[8]!, 6, 1873313359);
  d = ii(d, a, b, c, k[15]!, 10, -30611744);
  c = ii(c, d, a, b, k[6]!, 15, -1560198380);
  b = ii(b, c, d, a, k[13]!, 21, 1309151649);
  a = ii(a, b, c, d, k[4]!, 6, -145523070);
  d = ii(d, a, b, c, k[11]!, 10, -1120210379);
  c = ii(c, d, a, b, k[2]!, 15, 718787259);
  b = ii(b, c, d, a, k[9]!, 21, -343485551);
  x[0] = add32(a, x[0]!);
  x[1] = add32(b, x[1]!);
  x[2] = add32(c, x[2]!);
  x[3] = add32(d, x[3]!);
}

function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  a = add32(add32(a, q), add32(x, t));
  return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}

function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md51(s: string): number[] {
  const n = s.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;
  for (i = 64; i <= s.length; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  const tail: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (i = 0; i < s.length; i++) {
    tail[i >> 2]! |= s.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2]! |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

function md5blk(s: string): number[] {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] =
      s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks as number[];
}

const hexChr = '0123456789abcdef'.split('');

function rhex(n: number): string {
  let s = '';
  for (let j = 0; j < 4; j++) {
    s += hexChr[(n >> (j * 8 + 4)) & 0x0f]! + hexChr[(n >> (j * 8)) & 0x0f]!;
  }
  return s;
}

function hex(x: number[]): string {
  return x.map(rhex).join('');
}

function add32(a: number, b: number): number {
  return (a + b) & 0xffffffff;
}

export function md5(message: string): string {
  return hex(md51(message));
}

export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha512(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes: Uint8Array): string {
  let result = '';
  let i: number;
  for (i = 0; i < bytes.length - 2; i += 3) {
    result += BASE64_CHARS[bytes[i]! >> 2];
    result += BASE64_CHARS[((bytes[i]! & 0x03) << 4) | (bytes[i + 1]! >> 4)];
    result += BASE64_CHARS[((bytes[i + 1]! & 0x0f) << 2) | (bytes[i + 2]! >> 6)];
    result += BASE64_CHARS[bytes[i + 2]! & 0x3f];
  }
  if (i === bytes.length - 2) {
    result += BASE64_CHARS[bytes[i]! >> 2];
    result += BASE64_CHARS[((bytes[i]! & 0x03) << 4) | (bytes[i + 1]! >> 4)];
    result += BASE64_CHARS[(bytes[i + 1]! & 0x0f) << 2];
    result += '=';
  } else if (i === bytes.length - 1) {
    result += BASE64_CHARS[bytes[i]! >> 2];
    result += BASE64_CHARS[(bytes[i]! & 0x03) << 4];
    result += '==';
  }
  return result;
}

function base64ToBytes(base64: string): Uint8Array {
  const lookup = new Map<string, number>();
  for (let i = 0; i < BASE64_CHARS.length; i++) {
    lookup.set(BASE64_CHARS[i]!, i);
  }
  
  const bufferLength = base64.length * 0.75;
  const len = base64.length;
  let p = 0;
  let encoded1: number, encoded2: number, encoded3: number, encoded4: number;
  
  const bytes = new Uint8Array(bufferLength);
  
  for (let i = 0; i < len; i += 4) {
    encoded1 = lookup.get(base64[i]!) ?? 0;
    encoded2 = lookup.get(base64[i + 1]!) ?? 0;
    encoded3 = lookup.get(base64[i + 2]!) ?? 0;
    encoded4 = lookup.get(base64[i + 3]!) ?? 0;
    
    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }
  
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return bytes.slice(0, p - padding);
}

export function base64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return bytesToBase64(bytes);
}

export function base64Decode(base64: string): string {
  const bytes = base64ToBytes(base64);
  return new TextDecoder().decode(bytes);
}

export function base64UrlEncode(str: string): string {
  return base64Encode(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function base64UrlDecode(base64Url: string): string {
  let base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  
  return base64Decode(base64);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateNanoId(size: number = 21): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  let id = '';
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i]! % alphabet.length];
  }
  return id;
}

export async function generateAESKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptAES(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  );
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return bytesToBase64(combined);
}

export async function decryptAES(encryptedData: string, key: CryptoKey): Promise<string> {
  const combined = base64ToBytes(encryptedData);
  
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decrypted);
}

export function hashPassword(password: string, salt?: string): string {
  const s = salt || generateShortId(16);
  const hash = simpleHash(s + password + s);
  return `${s}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  if (!salt || !hash) return false;
  return simpleHash(salt + password + salt) === hash;
}

export function generateToken(length: number = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function obfuscate(str: string): string {
  const chars = str.split('');
  return chars
    .map((c, i) => {
      const code = c.charCodeAt(0);
      return String.fromCharCode(code + (i % 10) + 1);
    })
    .join('');
}

export function deobfuscate(str: string): string {
  const chars = str.split('');
  return chars
    .map((c, i) => {
      const code = c.charCodeAt(0);
      return String.fromCharCode(code - (i % 10) - 1);
    })
    .join('');
}
