import type { HttpClient } from '../http/client';
import type {
  FileVO,
  UploadInitVO,
  UploadChunkVO,
  PresignedUrlVO,
  UploadCredentialsVO,
  UploadPolicyVO,
  StorageUsageVO,
  UploadInitRequest,
  PresignedUrlRequest,
  UploadModule,
} from '../types/upload';
import type { ApiResult, PageResult } from '../types/common';
import { SdkworkError } from '../types/errors';
import { appApiPath } from './paths';

const SUCCESS_CODES = [0, 200, 2000];
const UPLOAD_BASE = appApiPath('/upload');

export class UploadApi implements UploadModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async uploadFile(file: File, type: string = 'other', folderId?: string, path: string = 'uploads'): Promise<FileVO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (folderId) formData.append('folderId', folderId);
    formData.append('path', path);

    const response = await this.client.requestRaw(`${UPLOAD_BASE}/file`, {
      method: 'POST',
      rawBody: formData,
      skipJsonContentType: true,
    });

    return this.parseApiResult<FileVO>(response);
  }

  async uploadFiles(files: File[], type: string = 'other', path: string = 'uploads'): Promise<FileVO[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);
    formData.append('path', path);

    const response = await this.client.requestRaw(`${UPLOAD_BASE}/files`, {
      method: 'POST',
      rawBody: formData,
      skipJsonContentType: true,
    });

    return this.parseApiResult<FileVO[]>(response);
  }

  async initChunkUpload(request: UploadInitRequest): Promise<UploadInitVO> {
    return this.client.post<UploadInitVO>(`${UPLOAD_BASE}/chunk/init`, request);
  }

  async uploadChunk(uploadId: string, chunkNumber: number, chunk: File): Promise<UploadChunkVO> {
    const formData = new FormData();
    formData.append('uploadId', uploadId);
    formData.append('chunkNumber', String(chunkNumber));
    formData.append('file', chunk);

    const response = await this.client.requestRaw(`${UPLOAD_BASE}/chunk`, {
      method: 'POST',
      rawBody: formData,
      skipJsonContentType: true,
    });

    return this.parseApiResult<UploadChunkVO>(response);
  }

  async mergeChunks(uploadId: string): Promise<FileVO> {
    return this.client.post<FileVO>(`${UPLOAD_BASE}/chunk/merge`, undefined, { uploadId });
  }

  async getChunkStatus(uploadId: string): Promise<number[]> {
    return this.client.get<number[]>(`${UPLOAD_BASE}/chunk/status`, { uploadId });
  }

  async cancelUpload(uploadId: string): Promise<void> {
    await this.client.delete(`${UPLOAD_BASE}/task/${uploadId}`);
  }

  async getUploadProgress(uploadId: string): Promise<UploadChunkVO> {
    return this.client.get<UploadChunkVO>(`${UPLOAD_BASE}/task/${uploadId}/progress`);
  }

  async uploadImage(file: File, compress: boolean = true, quality: number = 80, maxWidth?: number): Promise<FileVO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('compress', String(compress));
    formData.append('quality', String(quality));
    if (maxWidth) formData.append('maxWidth', String(maxWidth));

    const response = await this.client.requestRaw(`${UPLOAD_BASE}/image`, {
      method: 'POST',
      rawBody: formData,
      skipJsonContentType: true,
    });

    return this.parseApiResult<FileVO>(response);
  }

  async uploadBase64Image(base64Data: string, extension: string = 'png'): Promise<FileVO> {
    const formData = new FormData();
    formData.append('base64Data', base64Data);
    formData.append('extension', extension);

    const response = await this.client.requestRaw(`${UPLOAD_BASE}/image/base64`, {
      method: 'POST',
      rawBody: formData,
      skipJsonContentType: true,
    });

    return this.parseApiResult<FileVO>(response);
  }

  async getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlVO> {
    return this.client.post<PresignedUrlVO>(`${UPLOAD_BASE}/presigned-url`, request);
  }

  async getFilePresignedUrl(fileId: string, expires: number = 3600): Promise<PresignedUrlVO> {
    return this.client.get<PresignedUrlVO>(`${UPLOAD_BASE}/presigned-url/${fileId}`, { expires });
  }

  async getUploadCredentials(objectKey: string, bucket?: string, expires: number = 3600): Promise<UploadCredentialsVO> {
    const params: Record<string, string | number | boolean | undefined> = {
      objectKey,
      bucket,
      expires,
    };
    return this.client.post<UploadCredentialsVO>(`${UPLOAD_BASE}/upload-credentials`, params);
  }

  async getUploadPolicy(objectKey: string, bucket?: string, expires: number = 3600): Promise<UploadPolicyVO> {
    const params: Record<string, string | number | boolean | undefined> = {
      objectKey,
      bucket,
      expires,
    };
    return this.client.post<UploadPolicyVO>(`${UPLOAD_BASE}/upload-policy`, params);
  }

  async listFiles(page: number = 1, pageSize: number = 20, assetType?: string): Promise<FileVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      pageNum: page,
      pageSize,
      assetType,
    };
    const result = await this.client.get<PageResult<FileVO>>(`${UPLOAD_BASE}/files`, params);
    return result.content;
  }

  async getFileDetail(fileId: string): Promise<FileVO> {
    return this.client.get<FileVO>(`${UPLOAD_BASE}/files/${fileId}`);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.client.delete(`${UPLOAD_BASE}/files/${fileId}`);
  }

  async copyFile(fileId: string, targetPath: string): Promise<FileVO> {
    return this.client.post<FileVO>(`${UPLOAD_BASE}/files/${fileId}/copy`, undefined, { targetPath });
  }

  async getStorageUsage(): Promise<StorageUsageVO> {
    return this.client.get<StorageUsageVO>(`${UPLOAD_BASE}/storage/usage`);
  }

  private async parseApiResult<T>(response: Response): Promise<T> {
    const result = await response.json() as ApiResult<T>;
    if (!SUCCESS_CODES.includes(result.code)) {
      throw SdkworkError.fromApiResult(result);
    }
    return result.data;
  }
}

export function createUploadApi(client: HttpClient): UploadModule {
  return new UploadApi(client);
}
