import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  CategoryVO,
  CategoryTreeVO,
  CategoryDetailVO,
  CategoryTypeVO,
  TagVO,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryMoveRequest,
  CategorySortRequest,
  TagCreateRequest,
  CategoryQuery,
  CategoryModule,
} from '../types/category';

export class CategoryApi implements CategoryModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async getTree(type: string = 'asset'): Promise<CategoryTreeVO[]> {
    return this.client.get<CategoryTreeVO[]>(appApiPath('/category/tree'), { type });
  }

  async list(query: CategoryQuery): Promise<CategoryVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      type: query.type,
      parentId: query.parentId,
    };
    return this.client.get<CategoryVO[]>(appApiPath('/category'), params);
  }

  async getById(categoryId: string): Promise<CategoryDetailVO> {
    return this.client.get<CategoryDetailVO>(appApiPath(`/category/${categoryId}`));
  }

  async create(request: CategoryCreateRequest): Promise<CategoryVO> {
    return this.client.post<CategoryVO>(appApiPath('/category'), request);
  }

  async update(categoryId: string, request: CategoryUpdateRequest): Promise<CategoryVO> {
    return this.client.put<CategoryVO>(appApiPath(`/category/${categoryId}`), request);
  }

  async delete(categoryId: string): Promise<void> {
    await this.client.delete(appApiPath(`/category/${categoryId}`));
  }

  async move(categoryId: string, request: CategoryMoveRequest): Promise<CategoryVO> {
    return this.client.put<CategoryVO>(appApiPath(`/category/${categoryId}/move`), request);
  }

  async sort(request: CategorySortRequest): Promise<void> {
    await this.client.put(appApiPath('/category/sort'), request);
  }

  async updateStatus(categoryId: string, status: number): Promise<CategoryVO> {
    return this.client.put<CategoryVO>(appApiPath(`/category/${categoryId}/status`), undefined, { status });
  }

  async getChildren(categoryId: string): Promise<CategoryVO[]> {
    return this.client.get<CategoryVO[]>(appApiPath(`/category/${categoryId}/children`));
  }

  async getPath(categoryId: string): Promise<CategoryVO[]> {
    return this.client.get<CategoryVO[]>(appApiPath(`/category/${categoryId}/path`));
  }

  async getTypes(): Promise<CategoryTypeVO[]> {
    return this.client.get<CategoryTypeVO[]>(appApiPath('/category/types'));
  }

  async listTags(keyword?: string, hotCount?: number): Promise<TagVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { keyword, hot: hotCount };
    return this.client.get<TagVO[]>(appApiPath('/category/tags'), params);
  }

  async createTag(request: TagCreateRequest): Promise<TagVO> {
    return this.client.post<TagVO>(appApiPath('/category/tags'), request);
  }

  async deleteTag(tagId: string): Promise<void> {
    await this.client.delete(appApiPath(`/category/tags/${tagId}`));
  }
}

export function createCategoryApi(client: HttpClient): CategoryModule {
  return new CategoryApi(client);
}
