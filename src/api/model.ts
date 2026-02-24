import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  ModelInfoVO,
  ModelInfoDetailVO,
  ModelPriceVO,
  ModelTypeVO,
  ModelStatisticsVO,
  ModelSearchQuery,
  ModelModule,
} from '../types/model';
import type { PageResult } from '../types/common';

export class ModelApi implements ModelModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async getById(modelId: number): Promise<ModelInfoDetailVO> {
    return this.client.get<ModelInfoDetailVO>(appApiPath(`/models/${modelId}`));
  }

  async getByModel(model: string): Promise<ModelInfoDetailVO> {
    return this.client.get<ModelInfoDetailVO>(appApiPath(`/models/by-model/${encodeURIComponent(model)}`));
  }

  async getByChannel(channel: string, page: number = 1, size: number = 20): Promise<ModelInfoVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<ModelInfoVO>>(appApiPath(`/models/channel/${channel}`), params);
    return result.content;
  }

  async getByType(modelType: string, page: number = 1, size: number = 20): Promise<ModelInfoVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<ModelInfoVO>>(appApiPath(`/models/type/${modelType}`), params);
    return result.content;
  }

  async getByFamily(family: string, page: number = 1, size: number = 20): Promise<ModelInfoVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<ModelInfoVO>>(appApiPath(`/models/family/${encodeURIComponent(family)}`), params);
    return result.content;
  }

  async getActiveModels(modelType?: string, page: number = 1, size: number = 20): Promise<ModelInfoVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { modelType, page, size };
    const result = await this.client.get<PageResult<ModelInfoVO>>(appApiPath('/models/active'), params);
    return result.content;
  }

  async getPopularModels(page: number = 1, size: number = 20): Promise<ModelInfoVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { page, size };
    const result = await this.client.get<PageResult<ModelInfoVO>>(appApiPath('/models/popular'), params);
    return result.content;
  }

  async search(query: ModelSearchQuery): Promise<ModelInfoVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      keyword: query.keyword,
      channel: query.channel,
      modelType: query.modelType,
      status: query.status,
      family: query.family,
      openSource: query.openSource,
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<ModelInfoVO>>(appApiPath('/models/search'), params);
    return result.content;
  }

  async getAllFamilies(): Promise<string[]> {
    return this.client.get<string[]>(appApiPath('/models/families'));
  }

  async getPrice(model: string): Promise<ModelPriceVO> {
    return this.client.get<ModelPriceVO>(appApiPath(`/models/price/${encodeURIComponent(model)}`));
  }

  async getPrices(models: string[]): Promise<ModelPriceVO[]> {
    return this.client.post<ModelPriceVO[]>(appApiPath('/models/prices/batch'), models);
  }

  async getTypes(): Promise<ModelTypeVO[]> {
    return this.client.get<ModelTypeVO[]>(appApiPath('/models/types'));
  }

  async getStatistics(): Promise<ModelStatisticsVO> {
    return this.client.get<ModelStatisticsVO>(appApiPath('/models/statistics'));
  }
}

export function createModelApi(client: HttpClient): ModelModule {
  return new ModelApi(client);
}
