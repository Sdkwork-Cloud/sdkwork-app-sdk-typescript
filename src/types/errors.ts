export {
  SdkError,
  NetworkError,
  TimeoutError,
  CancelledError,
  AuthenticationError,
  TokenExpiredError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  BusinessError,
  isSdkError,
  isNetworkError,
  isAuthError,
  isRetryableError,
} from '@sdkwork/sdk-common/errors';

export type { ErrorCode, ErrorDetail } from '@sdkwork/sdk-common/errors';

import { SdkError, isSdkError } from '@sdkwork/sdk-common/errors';
export const SdkworkError = SdkError;
export const isSdkworkError = isSdkError;
