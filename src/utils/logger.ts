import type { Logger, LoggerConfig, LogLevel } from '../types/core';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};

const RESET_COLOR = '\x1b[0m';

class ConsoleLogger implements Logger {
  private config: Required<LoggerConfig>;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level || 'info',
      prefix: config.prefix || '[SDKWork]',
      timestamp: config.timestamp ?? true,
      colors: config.colors ?? (typeof process !== 'undefined' && process.stdout?.isTTY),
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level]! >= LOG_LEVELS[this.config.level]!;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];

    if (this.config.timestamp) {
      parts.push(new Date().toISOString());
    }

    parts.push(`[${level.toUpperCase()}]`);

    if (this.config.prefix) {
      parts.push(this.config.prefix);
    }

    parts.push(message);

    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, args: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message);
    const consoleMethod = level === 'debug' ? 'log' : level;
    const logFn = (console as unknown as Record<string, (...args: unknown[]) => void>)[consoleMethod];

    if (this.config.colors && typeof console !== 'undefined' && logFn) {
      logFn(LOG_COLORS[level]! + formattedMessage + RESET_COLOR, ...args);
    } else if (logFn) {
      logFn(formattedMessage, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, args);
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  setPrefix(prefix: string): void {
    this.config.prefix = prefix;
  }
}

class NoOpLogger implements Logger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
}

export function createLogger(config?: Partial<LoggerConfig>): Logger {
  if (typeof console === 'undefined') {
    return new NoOpLogger();
  }
  return new ConsoleLogger(config);
}

export const noopLogger = new NoOpLogger();

export type { Logger, LoggerConfig, LogLevel };
