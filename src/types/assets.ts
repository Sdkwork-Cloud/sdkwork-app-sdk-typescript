import type { BasePlusVO, PageResult } from './common';

export type AssetType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'MODEL' | 'OTHER';

export interface AssetVO extends BasePlusVO {
  assetId: string;
  name: string;
  type: AssetType;
  mimeType?: string;
  size?: number;
  extension?: string;
  url?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  folderId?: string;
  folderName?: string;
  status?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AssetDetailVO extends AssetVO {
  width?: number;
  height?: number;
  duration?: number;
  bitrate?: number;
  fps?: number;
  metadata?: Record<string, unknown>;
  tags?: string[];
  description?: string;
  author?: string;
  copyright?: string;
}

export interface AssetMediaResource {
  id: number;
  uuid?: string;
  url?: string;
  mimeType?: string;
  size?: number;
  name?: string;
  extension?: string;
}

export interface DownloadUrlVO extends BasePlusVO {
  resource: AssetMediaResource;
  expiresIn?: number;
}

export interface FolderVO extends BasePlusVO {
  folderId: string;
  name: string;
  parentId?: string;
  path?: string;
  assetCount?: number;
  subFolderCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AssetStatisticsVO extends BasePlusVO {
  totalAssets: number;
  imageCount: number;
  videoCount: number;
  audioCount: number;
  documentCount?: number;
  totalSize?: number;
  usedQuota?: number;
  totalQuota?: number;
}

export interface AssetListForm {
  type?: AssetType;
  folderId?: string;
  keyword?: string;
  status?: string;
  pageNum?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface AssetDownloadForm {
  format?: string;
  quality?: string;
}

export interface AssetMoveForm {
  folderId?: string;
}

export interface AssetRenameForm {
  name: string;
}

export interface FolderCreateForm {
  name: string;
  parentId?: string;
}

export interface AssetsModule {
  listAssets(query: AssetListForm): Promise<PageResult<AssetVO>>;
  getAssetDetail(assetId: string): Promise<AssetDetailVO>;
  getDownloadUrl(assetId: string, query?: AssetDownloadForm): Promise<DownloadUrlVO>;
  deleteAsset(assetId: string): Promise<void>;
  batchDeleteAssets(assetIds: number[]): Promise<void>;
  moveAsset(assetId: string, data: AssetMoveForm): Promise<void>;
  renameAsset(assetId: string, data: AssetRenameForm): Promise<void>;
  favoriteAsset(assetId: string): Promise<void>;
  unfavoriteAsset(assetId: string): Promise<void>;

  listFolders(): Promise<FolderVO[]>;
  createFolder(data: FolderCreateForm): Promise<FolderVO>;
  deleteFolder(folderId: string): Promise<void>;

  getStatistics(): Promise<AssetStatisticsVO>;
}
