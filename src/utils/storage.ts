export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
  get size(): number;
}

export interface StorageOptions {
  prefix?: string;
  serialize?: <T>(value: T) => string;
  deserialize?: <T>(value: string) => T;
}

function createFallbackStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() { return Object.keys(store).length; },
  };
}

abstract class BaseStorageAdapter implements StorageAdapter {
  protected storage: Storage;
  protected prefix: string;
  protected serialize: <T>(value: T) => string;
  protected deserialize: <T>(value: string) => T;

  constructor(
    getStorage: () => Storage,
    options: StorageOptions = {}
  ) {
    this.storage = typeof window !== 'undefined' ? getStorage() : createFallbackStorage();
    this.prefix = options.prefix ?? '';
    this.serialize = options.serialize ?? JSON.stringify;
    this.deserialize = options.deserialize ?? JSON.parse;
  }

  protected getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  get<T>(key: string): T | null {
    try {
      const value = this.storage.getItem(this.getKey(key));
      if (value === null) return null;
      return this.deserialize<T>(value);
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.storage.setItem(this.getKey(key), this.serialize(value));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  clear(): void {
    if (this.prefix) {
      this.keys().forEach((key) => this.remove(key));
    } else {
      this.storage.clear();
    }
  }

  has(key: string): boolean {
    return this.storage.getItem(this.getKey(key)) !== null;
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && (!this.prefix || key.startsWith(this.prefix))) {
        keys.push(this.prefix ? key.slice(this.prefix.length + 1) : key);
      }
    }
    return keys;
  }

  get size(): number {
    return this.keys().length;
  }
}

class LocalStorageAdapter extends BaseStorageAdapter {
  constructor(options: StorageOptions = {}) {
    super(() => window.localStorage, options);
  }
}

class SessionStorageAdapter extends BaseStorageAdapter {
  constructor(options: StorageOptions = {}) {
    super(() => window.sessionStorage, options);
  }
}

class MemoryStorageAdapter implements StorageAdapter {
  private storage: Map<string, unknown> = new Map();
  private prefix: string;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix ?? '';
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  get<T>(key: string): T | null {
    return (this.storage.get(this.getKey(key)) as T) ?? null;
  }

  set<T>(key: string, value: T): void {
    this.storage.set(this.getKey(key), value);
  }

  remove(key: string): void {
    this.storage.delete(this.getKey(key));
  }

  clear(): void {
    if (this.prefix) {
      this.keys().forEach((key) => this.remove(key));
    } else {
      this.storage.clear();
    }
  }

  has(key: string): boolean {
    return this.storage.has(this.getKey(key));
  }

  keys(): string[] {
    const keys: string[] = [];
    for (const key of this.storage.keys()) {
      if (!this.prefix || key.startsWith(this.prefix)) {
        keys.push(this.prefix ? key.slice(this.prefix.length + 1) : key);
      }
    }
    return keys;
  }

  get size(): number {
    return this.keys().length;
  }
}

export function createLocalStorage(options?: StorageOptions): StorageAdapter {
  return new LocalStorageAdapter(options);
}

export function createSessionStorage(options?: StorageOptions): StorageAdapter {
  return new SessionStorageAdapter(options);
}

export function createMemoryStorage(options?: StorageOptions): StorageAdapter {
  return new MemoryStorageAdapter(options);
}

export const localStorage = createLocalStorage();
export const sessionStorage = createSessionStorage();
export const memoryStorage = createMemoryStorage();
