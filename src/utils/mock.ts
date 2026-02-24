type MockHandler<T = unknown> = () => T | Promise<T>;

interface MockConfig<T = unknown> {
  handler: MockHandler<T>;
  delay?: number;
  error?: Error;
  shouldFail?: () => boolean;
}

export class MockClient {
  private mocks: Map<string, MockConfig> = new Map();
  private callHistory: Array<{ key: string; timestamp: number; result: unknown }> = [];
  private enabled: boolean;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  register<T>(key: string, handler: MockHandler<T>, options?: { delay?: number; error?: Error; shouldFail?: () => boolean }): void {
    this.mocks.set(key, {
      handler,
      delay: options?.delay ?? 0,
      error: options?.error,
      shouldFail: options?.shouldFail,
    });
  }

  unregister(key: string): void {
    this.mocks.delete(key);
  }

  clear(): void {
    this.mocks.clear();
    this.callHistory = [];
  }

  async mock<T>(key: string): Promise<T> {
    if (!this.enabled) {
      throw new Error(`Mock is disabled. Key: ${key}`);
    }

    const config = this.mocks.get(key);
    if (!config) {
      throw new Error(`No mock registered for key: ${key}`);
    }

    if (config.shouldFail?.() || config.error) {
      throw config.error ?? new Error(`Mock error for key: ${key}`);
    }

    if (config.delay && config.delay > 0) {
      await this.delay(config.delay);
    }

    const result = await config.handler();

    this.callHistory.push({
      key,
      timestamp: Date.now(),
      result,
    });

    return result as T;
  }

  has(key: string): boolean {
    return this.mocks.has(key);
  }

  getCallHistory(): Array<{ key: string; timestamp: number; result: unknown }> {
    return [...this.callHistory];
  }

  getCallCount(key?: string): number {
    if (key) {
      return this.callHistory.filter((call) => call.key === key).length;
    }
    return this.callHistory.length;
  }

  clearHistory(): void {
    this.callHistory = [];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function createMockClient(enabled?: boolean): MockClient {
  return new MockClient(enabled);
}

export function mockResponse<T>(data: T, delay?: number): MockHandler<T> {
  return () => {
    if (delay) {
      return new Promise((resolve) => setTimeout(() => resolve(data), delay));
    }
    return data;
  };
}

export function mockError(error: Error | string): Error {
  return typeof error === 'string' ? new Error(error) : error;
}

export function mockList<T>(items: T[], options?: { total?: number; page?: number; size?: number }): {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} {
  const page = options?.page ?? 0;
  const size = options?.size ?? items.length;
  const total = options?.total ?? items.length;

  const start = page * size;
  const end = start + size;
  const content = items.slice(start, end);

  return {
    content,
    totalElements: total,
    totalPages: Math.ceil(total / size),
    size,
    number: page,
  };
}

export function mockPaginate<T>(items: T[], page: number = 0, size: number = 10): T[] {
  const start = page * size;
  const end = start + size;
  return items.slice(start, end);
}

export function mockRandom<T>(items: T[]): T {
  const item = items[Math.floor(Math.random() * items.length)];
  if (item === undefined) {
    throw new Error('Cannot select from empty array');
  }
  return item;
}

export function mockRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function mockRandomFloat(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

export function mockRandomBoolean(): boolean {
  return Math.random() > 0.5;
}

export function mockRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function mockRandomEmail(): string {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  return `${mockRandomString(8).toLowerCase()}@${mockRandom(domains)}`;
}

export function mockRandomPhone(): string {
  return `+1${mockRandomInt(200, 999)}${mockRandomInt(100, 999)}${mockRandomInt(1000, 9999)}`;
}

export function mockRandomDate(start?: Date, end?: Date): Date {
  const startTime = start?.getTime() ?? new Date(2000, 0, 1).getTime();
  const endTime = end?.getTime() ?? new Date().getTime();
  return new Date(mockRandomInt(startTime, endTime));
}

export function mockRandomUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface FakerOptions {
  locale?: string;
}

export function mockPersonName(_options?: FakerOptions): string {
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  return `${mockRandom(firstNames)} ${mockRandom(lastNames)}`;
}

export function mockCompanyName(): string {
  const adjectives = ['Global', 'Tech', 'Digital', 'Smart', 'Advanced', 'Modern', 'Future', 'Innovative'];
  const nouns = ['Solutions', 'Systems', 'Technologies', 'Industries', 'Corp', 'Inc', 'Group', 'Labs'];
  return `${mockRandom(adjectives)} ${mockRandom(nouns)}`;
}

export function mockAddress(): { street: string; city: string; state: string; zip: string; country: string } {
  return {
    street: `${mockRandomInt(1, 9999)} ${mockRandom(['Main', 'Oak', 'Pine', 'Maple', 'Cedar'])} ${mockRandom(['St', 'Ave', 'Blvd', 'Rd'])}`,
    city: mockRandom(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego']),
    state: mockRandom(['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA']),
    zip: String(mockRandomInt(10000, 99999)),
    country: 'United States',
  };
}

export function mockLoremIpsum(sentences: number = 3): string {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];
  const result: string[] = [];

  for (let i = 0; i < sentences; i++) {
    const sentenceLength = mockRandomInt(8, 15);
    const sentence: string[] = [];
    for (let j = 0; j < sentenceLength; j++) {
      sentence.push(mockRandom(words));
    }
    const firstWord = sentence[0];
    if (firstWord) {
      sentence[0] = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    }
    result.push(sentence.join(' ') + '.');
  }

  return result.join(' ');
}

export type { MockHandler, MockConfig };
