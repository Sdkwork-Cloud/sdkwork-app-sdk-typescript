export interface CategoryVO {
  id: string;
  name: string;
  code?: string;
  icon?: string;
  description?: string;
  parentId?: string;
  sort?: number;
  status?: number;
}

export interface CategoryTreeVO extends CategoryVO {
  children?: CategoryTreeVO[];
}

export interface CategoryDetailVO extends CategoryVO {
  type?: string;
  groupName?: string;
  visible?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryTypeVO {
  type: string;
  name: string;
  description?: string;
}

export interface TagVO {
  id: string;
  name: string;
  count?: number;
}

export interface CategoryCreateRequest {
  name: string;
  code?: string;
  type?: string;
  icon?: string;
  description?: string;
  parentId?: string;
  sort?: number;
  status?: number;
}

export interface CategoryUpdateRequest {
  name?: string;
  icon?: string;
  description?: string;
  sort?: number;
  status?: number;
}

export interface CategoryMoveRequest {
  targetParentId?: string;
}

export interface CategorySortRequest {
  categoryId: string;
}

export interface TagCreateRequest {
  name: string;
}

export interface CategoryQuery {
  type?: string;
  parentId?: string;
}

export interface CategoryModule {
  getTree(type?: string): Promise<CategoryTreeVO[]>;
  list(query: CategoryQuery): Promise<CategoryVO[]>;
  getById(categoryId: string): Promise<CategoryDetailVO>;
  create(request: CategoryCreateRequest): Promise<CategoryVO>;
  update(categoryId: string, request: CategoryUpdateRequest): Promise<CategoryVO>;
  delete(categoryId: string): Promise<void>;
  move(categoryId: string, request: CategoryMoveRequest): Promise<CategoryVO>;
  sort(request: CategorySortRequest): Promise<void>;
  updateStatus(categoryId: string, status: number): Promise<CategoryVO>;
  getChildren(categoryId: string): Promise<CategoryVO[]>;
  getPath(categoryId: string): Promise<CategoryVO[]>;
  getTypes(): Promise<CategoryTypeVO[]>;
  listTags(keyword?: string, hotCount?: number): Promise<TagVO[]>;
  createTag(request: TagCreateRequest): Promise<TagVO>;
  deleteTag(tagId: string): Promise<void>;
}
