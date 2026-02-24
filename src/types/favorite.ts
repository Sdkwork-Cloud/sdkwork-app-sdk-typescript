export interface FavoriteVO {
  favoriteId: string;
  favoriteType: string;
  targetId: string;
  favoriteName?: string;
  folderId?: string;
  favoriteTime?: string;
  updateTime?: string;
}

export interface FavoriteItemVO extends FavoriteVO {}

export interface FavoriteDetailVO extends FavoriteVO {}

export interface FavoriteFolderVO {
  folderId: string;
  folderName: string;
  parentFolderId?: string;
  folderDescription?: string;
  createTime?: string;
  updateTime?: string;
  favoriteCount?: number;
}

export interface FavoriteCheckVO {
  targetId: string;
  isFavorite: boolean;
  favoriteId?: string;
  favoriteTime?: string;
}

export interface FavoriteStatisticsVO {
  totalCount: number;
  folderCount: number;
  monthlyAdded?: number;
  countByType?: Record<string, number>;
}

export interface FavoriteTypeCountVO {
  type: string;
  typeName?: string;
  count: number;
}

export interface FavoriteAddRequest {
  type: string;
  targetId: string;
  favoriteName?: string;
  folderId?: string;
}

export interface FavoriteQuery {
  type?: string;
  folderId?: string;
  page?: number;
  size?: number;
}

export interface FavoriteBatchRemoveRequest {
  favoriteIds: string[];
}

export interface FavoriteBatchCheckRequest {
  items: Array<{ type: string; targetId: string }>;
}

export interface FavoriteFolderCreateRequest {
  name: string;
  folderDescription?: string;
  parentFolderId?: string;
}

export interface FavoriteFolderUpdateRequest {
  folderName?: string;
  folderDescription?: string;
}

export interface FavoriteMoveRequest {
  folderId?: string;
}

export interface FavoriteBatchMoveRequest {
  favoriteIds: string[];
  folderId?: string;
}

export interface FavoriteModule {
  add(request: FavoriteAddRequest): Promise<FavoriteVO>;
  remove(favoriteId: string): Promise<void>;
  batchRemove(request: FavoriteBatchRemoveRequest): Promise<void>;
  removeByTarget(type: string, targetId: string): Promise<void>;
  list(query: FavoriteQuery): Promise<FavoriteItemVO[]>;
  getById(favoriteId: string): Promise<FavoriteDetailVO>;
  check(type: string, targetId: string): Promise<FavoriteCheckVO>;
  batchCheck(request: FavoriteBatchCheckRequest): Promise<FavoriteCheckVO[]>;
  listFolders(): Promise<FavoriteFolderVO[]>;
  createFolder(request: FavoriteFolderCreateRequest): Promise<FavoriteFolderVO>;
  updateFolder(folderId: string, request: FavoriteFolderUpdateRequest): Promise<FavoriteFolderVO>;
  deleteFolder(folderId: string, deleteItems?: boolean): Promise<void>;
  moveToFolder(favoriteId: string, request: FavoriteMoveRequest): Promise<FavoriteVO>;
  batchMove(request: FavoriteBatchMoveRequest): Promise<void>;
  getStatistics(): Promise<FavoriteStatisticsVO>;
  getCountByType(): Promise<FavoriteTypeCountVO[]>;
  getRecent(limit?: number): Promise<FavoriteItemVO[]>;
}
