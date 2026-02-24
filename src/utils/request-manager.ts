export interface PendingRequest {
  id: string;
  url: string;
  method: string;
  startTime: number;
  controller: AbortController;
}

export interface RequestQueueOptions {
  maxConcurrent?: number;
  maxQueueSize?: number;
  timeout?: number;
}

export class RequestManager {
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private queue: Array<() => Promise<unknown>> = [];
  private activeCount: number = 0;
  private maxConcurrent: number;
  private maxQueueSize: number;

  constructor(options: RequestQueueOptions = {}) {
    this.maxConcurrent = options.maxConcurrent ?? 6;
    this.maxQueueSize = options.maxQueueSize ?? 100;
  }

  generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  addRequest(
    url: string,
    method: string,
    controller: AbortController
  ): string {
    const id = this.generateRequestId();
    this.pendingRequests.set(id, {
      id,
      url,
      method,
      startTime: Date.now(),
      controller,
    });
    return id;
  }

  removeRequest(id: string): void {
    this.pendingRequests.delete(id);
  }

  cancelRequest(id: string): boolean {
    const request = this.pendingRequests.get(id);
    if (request) {
      request.controller.abort();
      this.pendingRequests.delete(id);
      return true;
    }
    return false;
  }

  cancelAllRequests(): number {
    let count = 0;
    this.pendingRequests.forEach((request) => {
      request.controller.abort();
      count++;
    });
    this.pendingRequests.clear();
    return count;
  }

  cancelRequestsByUrl(urlPattern: string | RegExp): number {
    let count = 0;
    this.pendingRequests.forEach((request, id) => {
      const matches = typeof urlPattern === 'string'
        ? request.url.includes(urlPattern)
        : urlPattern.test(request.url);
      
      if (matches) {
        request.controller.abort();
        this.pendingRequests.delete(id);
        count++;
      }
    });
    return count;
  }

  getPendingRequests(): PendingRequest[] {
    return Array.from(this.pendingRequests.values());
  }

  getPendingCount(): number {
    return this.pendingRequests.size;
  }

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error('Request queue is full');
    }

    return new Promise((resolve, reject) => {
      const execute = async () => {
        this.activeCount++;
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeCount--;
          this.processQueue();
        }
      };

      if (this.activeCount < this.maxConcurrent) {
        execute();
      } else {
        this.queue.push(execute);
      }
    });
  }

  private processQueue(): void {
    if (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getActiveCount(): number {
    return this.activeCount;
  }

  clearQueue(): void {
    this.queue = [];
  }
}

export function createRequestManager(options?: RequestQueueOptions): RequestManager {
  return new RequestManager(options);
}
