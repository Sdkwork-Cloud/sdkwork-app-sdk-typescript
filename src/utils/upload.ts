export interface UploadOptions {
  url: string;
  file: File | Blob;
  fieldName?: string;
  headers?: Record<string, string>;
  data?: Record<string, string | Blob>;
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (response: unknown) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
  withCredentials?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number;
  remaining: number;
}

export interface ChunkUploadOptions {
  url: string;
  file: File;
  chunkSize?: number;
  concurrency?: number;
  headers?: Record<string, string>;
  onProgress?: (progress: UploadProgress) => void;
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
  onComplete?: (response: unknown) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

export interface ChunkInfo {
  index: number;
  start: number;
  end: number;
  blob: Blob;
}

export class FileUploader {
  private xhr: XMLHttpRequest | null = null;

  upload(options: UploadOptions): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;

      const formData = new FormData();
      const fieldName = options.fieldName ?? 'file';
      formData.append(fieldName, options.file);

      if (options.data) {
        Object.entries(options.data).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && options.onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
            speed: 0,
            remaining: 0,
          };
          options.onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = this.parseResponse(xhr.responseText);
          options.onSuccess?.(response);
          resolve(response);
        } else {
          const error = new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`);
          options.onError?.(error);
          reject(error);
        }
        this.xhr = null;
      };

      xhr.onerror = () => {
        const error = new Error('Upload failed: Network error');
        options.onError?.(error);
        reject(error);
        this.xhr = null;
      };

      xhr.onabort = () => {
        const error = new Error('Upload cancelled');
        options.onError?.(error);
        reject(error);
        this.xhr = null;
      };

      xhr.open('POST', options.url);

      if (options.withCredentials) {
        xhr.withCredentials = true;
      }

      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      }

      xhr.send(formData);
    });
  }

  abort(): void {
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }
  }

  private parseResponse(responseText: string): unknown {
    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  }
}

export class ChunkUploader {
  private aborted = false;
  private activeUploads = 0;

  async upload(options: ChunkUploadOptions): Promise<unknown> {
    const { file, chunkSize = 5 * 1024 * 1024, concurrency = 3 } = options;
    const chunks = this.createChunks(file, chunkSize);
    const totalChunks = chunks.length;

    this.aborted = false;
    let uploadedChunks = 0;
    let uploadedBytes = 0;
    const startTime = Date.now();

    const uploadChunk = async (chunk: ChunkInfo): Promise<void> => {
      if (this.aborted) {
        throw new Error('Upload cancelled');
      }

      const formData = new FormData();
      formData.append('file', chunk.blob);
      formData.append('chunkIndex', String(chunk.index));
      formData.append('totalChunks', String(totalChunks));
      formData.append('fileName', file.name);
      formData.append('fileSize', String(file.size));

      const response = await fetch(options.url, {
        method: 'POST',
        headers: options.headers,
        body: formData,
        signal: options.signal,
      });

      if (!response.ok) {
        throw new Error(`Chunk upload failed: ${response.status}`);
      }

      uploadedChunks++;
      uploadedBytes += chunk.blob.size;

      options.onChunkComplete?.(chunk.index, totalChunks);

      if (options.onProgress) {
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = uploadedBytes / elapsed;
        const remaining = (file.size - uploadedBytes) / speed;

        options.onProgress({
          loaded: uploadedBytes,
          total: file.size,
          percentage: Math.round((uploadedBytes / file.size) * 100),
          speed,
          remaining,
        });
      }
    };

    const results: PromiseSettledResult<void>[] = [];

    for (let i = 0; i < chunks.length; i += concurrency) {
      if (this.aborted) break;

      const batch = chunks.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map((chunk) => {
          this.activeUploads++;
          return uploadChunk(chunk).finally(() => {
            this.activeUploads--;
          });
        })
      );
      results.push(...batchResults);
    }

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      const error = new Error(`${failed.length} chunks failed to upload`);
      options.onError?.(error);
      throw error;
    }

    const completeResponse = await this.completeUpload(options, totalChunks);
    options.onComplete?.(completeResponse);
    return completeResponse;
  }

  private createChunks(file: File, chunkSize: number): ChunkInfo[] {
    const chunks: ChunkInfo[] = [];
    let index = 0;

    for (let start = 0; start < file.size; start += chunkSize) {
      const end = Math.min(start + chunkSize, file.size);
      chunks.push({
        index,
        start,
        end,
        blob: file.slice(start, end),
      });
      index++;
    }

    return chunks;
  }

  private async completeUpload(
    options: ChunkUploadOptions,
    totalChunks: number
  ): Promise<unknown> {
    const response = await fetch(`${options.url}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify({
        fileName: options.file.name,
        fileSize: options.file.size,
        totalChunks,
      }),
      signal: options.signal,
    });

    if (!response.ok) {
      throw new Error('Failed to complete upload');
    }

    return response.json();
  }

  abort(): void {
    this.aborted = true;
  }

  getActiveUploads(): number {
    return this.activeUploads;
  }
}

export function createFileUploader(): FileUploader {
  return new FileUploader();
}

export function createChunkUploader(): ChunkUploader {
  return new ChunkUploader();
}

export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.slice(lastDot + 1).toLowerCase() : '';
}

export function getMimeType(filename: string): string {
  const extension = getFileExtension(filename);
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
    zip: 'application/zip',
    json: 'application/json',
    xml: 'application/xml',
    txt: 'text/plain',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
  };
  return mimeTypes[extension] || 'application/octet-stream';
}
