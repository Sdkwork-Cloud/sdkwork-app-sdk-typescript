import type { HttpClient } from '../http/client';
import type {
  AssetsModule,
  AssetVO,
  AssetDetailVO,
  DownloadUrlVO,
  FolderVO,
  AssetStatisticsVO,
  AssetListForm,
  AssetDownloadForm,
  AssetMoveForm,
  AssetRenameForm,
  FolderCreateForm,
} from '../types/assets';
import type { PageResult } from '../types/common';
import { appApiPath } from './paths';

const ASSETS_BASE = appApiPath('/assets');

export class AssetsApi implements AssetsModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async listAssets(query: AssetListForm): Promise<PageResult<AssetVO>> {
    return this.http.get(ASSETS_BASE, query);
  }

  async getAssetDetail(assetId: string): Promise<AssetDetailVO> {
    return this.http.get(`${ASSETS_BASE}/${assetId}`);
  }

  async getDownloadUrl(assetId: string, query?: AssetDownloadForm): Promise<DownloadUrlVO> {
    return this.http.get(`${ASSETS_BASE}/${assetId}/download`, query);
  }

  async deleteAsset(assetId: string): Promise<void> {
    await this.http.delete(`${ASSETS_BASE}/${assetId}`);
  }

  async batchDeleteAssets(assetIds: number[]): Promise<void> {
    await this.http.delete(`${ASSETS_BASE}/batch`, assetIds);
  }

  async moveAsset(assetId: string, data: AssetMoveForm): Promise<void> {
    await this.http.put(`${ASSETS_BASE}/${assetId}/move`, data);
  }

  async renameAsset(assetId: string, data: AssetRenameForm): Promise<void> {
    await this.http.put(`${ASSETS_BASE}/${assetId}/rename`, data);
  }

  async favoriteAsset(assetId: string): Promise<void> {
    await this.http.post(`${ASSETS_BASE}/${assetId}/favorite`);
  }

  async unfavoriteAsset(assetId: string): Promise<void> {
    await this.http.delete(`${ASSETS_BASE}/${assetId}/favorite`);
  }

  async listFolders(): Promise<FolderVO[]> {
    return this.http.get(`${ASSETS_BASE}/folders`);
  }

  async createFolder(data: FolderCreateForm): Promise<FolderVO> {
    return this.http.post(`${ASSETS_BASE}/folders`, data);
  }

  async deleteFolder(folderId: string): Promise<void> {
    await this.http.delete(`${ASSETS_BASE}/folders/${folderId}`);
  }

  async getStatistics(): Promise<AssetStatisticsVO> {
    return this.http.get(`${ASSETS_BASE}/statistics`);
  }
}

export function createAssetsApi(http: HttpClient): AssetsModule {
  return new AssetsApi(http);
}
