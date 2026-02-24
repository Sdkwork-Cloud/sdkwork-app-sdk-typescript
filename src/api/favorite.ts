import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  FavoriteVO,
  FavoriteItemVO,
  FavoriteDetailVO,
  FavoriteFolderVO,
  FavoriteCheckVO,
  FavoriteStatisticsVO,
  FavoriteTypeCountVO,
  FavoriteAddRequest,
  FavoriteQuery,
  FavoriteBatchRemoveRequest,
  FavoriteBatchCheckRequest,
  FavoriteFolderCreateRequest,
  FavoriteFolderUpdateRequest,
  FavoriteMoveRequest,
  FavoriteBatchMoveRequest,
  FavoriteModule,
} from '../types/favorite';
import type { PageResult } from '../types/common';

export class FavoriteApi implements FavoriteModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async add(request: FavoriteAddRequest): Promise<FavoriteVO> {
    return this.client.post<FavoriteVO>(appApiPath('/favorite'), request);
  }

  async remove(favoriteId: string): Promise<void> {
    await this.client.delete(appApiPath(`/favorite/${favoriteId}`));
  }

  async batchRemove(request: FavoriteBatchRemoveRequest): Promise<void> {
    await this.client.delete(appApiPath('/favorite/batch'), request);
  }

  async removeByTarget(type: string, targetId: string): Promise<void> {
    await this.client.delete(appApiPath('/favorite/by-target'), undefined, { type, targetId });
  }

  async list(query: FavoriteQuery): Promise<FavoriteItemVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      type: query.type,
      folderId: query.folderId,
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<FavoriteItemVO>>(appApiPath('/favorite'), params);
    return result.content;
  }

  async getById(favoriteId: string): Promise<FavoriteDetailVO> {
    return this.client.get<FavoriteDetailVO>(appApiPath(`/favorite/${favoriteId}`));
  }

  async check(type: string, targetId: string): Promise<FavoriteCheckVO> {
    return this.client.get<FavoriteCheckVO>(appApiPath('/favorite/check'), { type, targetId });
  }

  async batchCheck(request: FavoriteBatchCheckRequest): Promise<FavoriteCheckVO[]> {
    return this.client.post<FavoriteCheckVO[]>(appApiPath('/favorite/batch-check'), request);
  }

  async listFolders(): Promise<FavoriteFolderVO[]> {
    return this.client.get<FavoriteFolderVO[]>(appApiPath('/favorite/folders'));
  }

  async createFolder(request: FavoriteFolderCreateRequest): Promise<FavoriteFolderVO> {
    return this.client.post<FavoriteFolderVO>(appApiPath('/favorite/folders'), request);
  }

  async updateFolder(folderId: string, request: FavoriteFolderUpdateRequest): Promise<FavoriteFolderVO> {
    return this.client.put<FavoriteFolderVO>(appApiPath(`/favorite/folders/${folderId}`), request);
  }

  async deleteFolder(folderId: string, deleteItems: boolean = false): Promise<void> {
    await this.client.delete(appApiPath(`/favorite/folders/${folderId}`), undefined, { deleteItems });
  }

  async moveToFolder(favoriteId: string, request: FavoriteMoveRequest): Promise<FavoriteVO> {
    return this.client.put<FavoriteVO>(appApiPath(`/favorite/${favoriteId}/move`), request);
  }

  async batchMove(request: FavoriteBatchMoveRequest): Promise<void> {
    await this.client.put(appApiPath('/favorite/batch/move'), request);
  }

  async getStatistics(): Promise<FavoriteStatisticsVO> {
    return this.client.get<FavoriteStatisticsVO>(appApiPath('/favorite/statistics'));
  }

  async getCountByType(): Promise<FavoriteTypeCountVO[]> {
    return this.client.get<FavoriteTypeCountVO[]>(appApiPath('/favorite/count/by-type'));
  }

  async getRecent(limit: number = 10): Promise<FavoriteItemVO[]> {
    return this.client.get<FavoriteItemVO[]>(appApiPath('/favorite/recent'), { limit });
  }
}

export function createFavoriteApi(client: HttpClient): FavoriteModule {
  return new FavoriteApi(client);
}
