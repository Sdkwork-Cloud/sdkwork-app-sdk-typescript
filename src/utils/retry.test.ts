import { describe, expect, it, vi } from 'vitest';
import { withRetry } from './retry';
import { NetworkError } from '../types/errors';

describe('withRetry', () => {
  it('should honor custom maxRetries in default retry condition', async () => {
    const task = vi.fn().mockRejectedValue(new NetworkError('network error'));

    await expect(
      withRetry(task, {
        maxRetries: 5,
        retryDelay: 0,
      })
    ).rejects.toBeInstanceOf(NetworkError);

    expect(task).toHaveBeenCalledTimes(6);
  });
});
