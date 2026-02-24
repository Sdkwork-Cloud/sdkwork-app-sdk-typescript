import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from './client';
import { CancelledError } from '../types/errors';

function createApiResponse<T>(data: T): Response {
  return new Response(
    JSON.stringify({
      code: 0,
      message: 'ok',
      data,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

describe('HttpClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should unwrap axios style params for GET requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });

    await client.get('/app/v3/api/demo', { params: { page: 1, size: 20 } });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/app/v3/api/demo?page=1&size=20');
  });

  it('should normalize legacy /v3/api path to /app/v3/api', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });

    await client.get('/v3/api/demo');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/app/v3/api/demo');
  });

  it('should merge request params with existing query string', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });

    await client.get('/app/v3/api/demo?existing=1', { page: 2 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/app/v3/api/demo?existing=1&page=2');
  });

  it('should keep absolute url untouched and append params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });

    await client.get('https://upload.example.com/presigned?token=abc', { partNumber: 1 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://upload.example.com/presigned?token=abc&partNumber=1');
  });

  it('should map axios style delete data to request body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse(null));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });

    await client.delete('/app/v3/api/demo', { data: { id: 123 } });

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(requestInit.method).toBe('DELETE');
    expect(requestInit.body).toBe(JSON.stringify({ id: 123 }));
  });

  it('should append query params for POST requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });

    await client.post('/app/v3/api/demo', { value: 1 }, { traceId: 'abc' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/app/v3/api/demo?traceId=abc');
    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(requestInit.body).toBe(JSON.stringify({ value: 1 }));
  });

  it('should append query params for DELETE requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createApiResponse(null));
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });

    await client.delete('/app/v3/api/demo', undefined, { type: 'all' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/app/v3/api/demo?type=all');
  });

  it('should throw CancelledError for caller aborted requests', async () => {
    const abortError = new Error('aborted');
    abortError.name = 'AbortError';

    const fetchMock = vi.fn().mockImplementation(
      async (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal;
          if (!signal) {
            reject(abortError);
            return;
          }

          if (signal.aborted) {
            reject(abortError);
            return;
          }

          signal.addEventListener(
            'abort',
            () => {
              reject(abortError);
            },
            { once: true }
          );
        })
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient({
      baseUrl: 'https://api.example.com',
    });
    const controller = new AbortController();

    const promise = client.request('/app/v3/api/demo', {
      signal: controller.signal,
      timeout: 5000,
      retry: {
        maxRetries: 0,
      },
    });

    controller.abort();

    await expect(promise).rejects.toBeInstanceOf(CancelledError);
  });
});
