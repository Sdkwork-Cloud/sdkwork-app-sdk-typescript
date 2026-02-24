export interface FileVO {
  id: string;
  name: string;
  originalName?: string;
  path: string;
  url?: string;
  size: number;
  mimeType?: string;
  extension?: string;
  assetType?: string;
  status?: string;
  createdAt?: string;
}

export interface UploadInitVO {
  uploadId: string;
  fileName: string;
  fileSize: number;
  chunkSize: number;
  totalChunks?: number;
  storagePath: string;
  supportResume: boolean;
  uploadType: string;
  expireTime: number;
}

export interface UploadChunkVO {
  uploadId: string;
  chunkIndex?: number;
  chunkSize?: number;
  status: string;
  success?: boolean;
  progress?: number;
}

export interface PresignedUrlVO {
  url: string;
  method: string;
  expires: number;
  objectKey: string;
  headers?: Record<string, string>;
}

export interface UploadCredentialsVO {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  expiration?: string;
  bucket: string;
  region?: string;
}

export interface UploadPolicyVO {
  policy: string;
  signature: string;
  accessKeyId: string;
  bucket: string;
  objectKey: string;
  expiration: number;
}

export interface StorageUsageVO {
  totalSize: number;
  usedSize: number;
  remainingSize: number;
  fileCount: number;
}

export interface UploadInitRequest {
  fileName: string;
  fileSize: number;
  fileType?: string;
  storagePath?: string;
  chunkSize?: number;
  totalChunks?: number;
}

export interface PresignedUrlRequest {
  objectKey: string;
  method?: string;
  bucket?: string;
  expirationSeconds?: number;
}

export interface UploadModule {
  uploadFile(file: File, type?: string, folderId?: string, path?: string): Promise<FileVO>;
  uploadFiles(files: File[], type?: string, path?: string): Promise<FileVO[]>;
  initChunkUpload(request: UploadInitRequest): Promise<UploadInitVO>;
  uploadChunk(uploadId: string, chunkNumber: number, chunk: File): Promise<UploadChunkVO>;
  mergeChunks(uploadId: string): Promise<FileVO>;
  getChunkStatus(uploadId: string): Promise<number[]>;
  cancelUpload(uploadId: string): Promise<void>;
  getUploadProgress(uploadId: string): Promise<UploadChunkVO>;
  uploadImage(file: File, compress?: boolean, quality?: number, maxWidth?: number): Promise<FileVO>;
  uploadBase64Image(base64Data: string, extension?: string): Promise<FileVO>;
  getPresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlVO>;
  getFilePresignedUrl(fileId: string, expires?: number): Promise<PresignedUrlVO>;
  getUploadCredentials(objectKey: string, bucket?: string, expires?: number): Promise<UploadCredentialsVO>;
  getUploadPolicy(objectKey: string, bucket?: string, expires?: number): Promise<UploadPolicyVO>;
  listFiles(page?: number, pageSize?: number, assetType?: string): Promise<FileVO[]>;
  getFileDetail(fileId: string): Promise<FileVO>;
  deleteFile(fileId: string): Promise<void>;
  copyFile(fileId: string, targetPath: string): Promise<FileVO>;
  getStorageUsage(): Promise<StorageUsageVO>;
}
