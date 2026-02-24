import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  ProductVO,
  ProductDetailVO,
  SkuVO,
  ProductStatisticsVO,
  ProductQuery,
  ProductModule,
} from '../types/product';
import type { PageResult } from '../types/common';

export class ProductApi implements ProductModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async list(query: ProductQuery): Promise<ProductVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      keyword: query.keyword,
      categoryId: query.categoryId,
      status: query.status,
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<ProductVO>>(appApiPath('/products'), params);
    return result.content;
  }

  async getById(productId: string): Promise<ProductDetailVO> {
    return this.client.get<ProductDetailVO>(appApiPath(`/products/${productId}`));
  }

  async getSkus(productId: string, status?: number): Promise<SkuVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { status };
    return this.client.get<SkuVO[]>(appApiPath(`/products/${productId}/skus`), params);
  }

  async getStatistics(productId: string): Promise<ProductStatisticsVO> {
    return this.client.get<ProductStatisticsVO>(appApiPath(`/products/${productId}/statistics`));
  }

  async getHotProducts(limit: number = 10): Promise<ProductVO[]> {
    return this.client.get<ProductVO[]>(appApiPath('/products/hot'), { limit });
  }

  async getLatestProducts(limit: number = 10): Promise<ProductVO[]> {
    return this.client.get<ProductVO[]>(appApiPath('/products/latest'), { limit });
  }

  async getByCategory(categoryId: string, page: number = 1, size: number = 20, status?: string): Promise<ProductVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size, status };
    const result = await this.client.get<PageResult<ProductVO>>(appApiPath(`/products/category/${categoryId}`), params);
    return result.content;
  }

  async search(keyword: string, page: number = 1, size: number = 20, categoryId?: string): Promise<ProductVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { keyword, page, size, categoryId };
    const result = await this.client.get<PageResult<ProductVO>>(appApiPath('/products/search'), params);
    return result.content;
  }

  async getByCode(code: string): Promise<ProductVO> {
    return this.client.get<ProductVO>(appApiPath(`/products/code/${code}`));
  }

  async getStock(productId: string): Promise<number> {
    return this.client.get<number>(appApiPath(`/products/${productId}/stock`));
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    return this.client.get<boolean>(appApiPath(`/products/${productId}/check-stock`), { quantity });
  }
}

export function createProductApi(client: HttpClient): ProductModule {
  return new ProductApi(client);
}
