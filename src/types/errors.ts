export type ErrorCode = 
  | 'UNKNOWN'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'CANCELLED';

export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
  value?: unknown;
}

export class SdkworkError extends Error {
  public readonly code: number;
  public readonly errorCode: ErrorCode;
  public readonly data?: unknown;
  public readonly details?: ErrorDetail[];
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    message: string,
    code: number = 0,
    errorCode: ErrorCode = 'UNKNOWN',
    data?: unknown,
    details?: ErrorDetail[],
    requestId?: string
  ) {
    super(message);
    this.name = 'SdkworkError';
    this.code = code;
    this.errorCode = errorCode;
    this.data = data;
    this.details = details;
    this.timestamp = new Date();
    this.requestId = requestId;
    
    Object.setPrototypeOf(this, SdkworkError.prototype);
  }

  static fromApiResult(result: { code: number; message: string; data?: unknown; traceId?: string }): SdkworkError {
    const errorCode = mapCodeToErrorCode(result.code);
    return new SdkworkError(
      result.message || 'Request failed',
      result.code,
      errorCode,
      result.data,
      undefined,
      result.traceId
    );
  }

  isNetworkError(): boolean {
    return this.errorCode === 'NETWORK_ERROR' || this.errorCode === 'TIMEOUT';
  }

  isAuthError(): boolean {
    return this.errorCode === 'UNAUTHORIZED' || this.errorCode === 'TOKEN_EXPIRED' || this.errorCode === 'TOKEN_INVALID';
  }

  isClientError(): boolean {
    return this.code >= 400 && this.code < 500;
  }

  isServerError(): boolean {
    return this.code >= 500;
  }

  isRetryable(): boolean {
    return this.errorCode === 'NETWORK_ERROR' || 
           this.errorCode === 'TIMEOUT' || 
           this.errorCode === 'RATE_LIMITED' ||
           this.isServerError();
  }

  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      errorCode: this.errorCode,
      data: this.data,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
    };
  }
}

export class NetworkError extends SdkworkError {
  constructor(message: string = 'Network request failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class TimeoutError extends SdkworkError {
  constructor(message: string = 'Request timeout') {
    super(message, 0, 'TIMEOUT');
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class AuthenticationError extends SdkworkError {
  constructor(message: string = 'Authentication failed', code: number = 401) {
    super(message, code, 'UNAUTHORIZED');
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class TokenExpiredError extends SdkworkError {
  constructor(message: string = 'Token has expired') {
    super(message, 401, 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

export class ForbiddenError extends SdkworkError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends SdkworkError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ValidationError extends SdkworkError {
  constructor(message: string = 'Validation failed', details?: ErrorDetail[]) {
    super(message, 400, 'VALIDATION_ERROR', undefined, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class RateLimitError extends SdkworkError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMITED');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class ServerError extends SdkworkError {
  constructor(message: string = 'Internal server error', code: number = 500) {
    super(message, code, 'SERVER_ERROR');
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class CancelledError extends SdkworkError {
  constructor(message: string = 'Request was cancelled') {
    super(message, 0, 'CANCELLED');
    this.name = 'CancelledError';
    Object.setPrototypeOf(this, CancelledError.prototype);
  }
}

function mapCodeToErrorCode(code: number): ErrorCode {
  if (code === 401) return 'UNAUTHORIZED';
  if (code === 403) return 'FORBIDDEN';
  if (code === 404) return 'NOT_FOUND';
  if (code === 400) return 'VALIDATION_ERROR';
  if (code === 429) return 'RATE_LIMITED';
  if (code >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN';
}

export function isSdkworkError(error: unknown): error is SdkworkError {
  return error instanceof SdkworkError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isAuthError(error: unknown): error is AuthenticationError | TokenExpiredError {
  return error instanceof AuthenticationError || error instanceof TokenExpiredError;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof SdkworkError) {
    return error.isRetryable();
  }
  return false;
}
