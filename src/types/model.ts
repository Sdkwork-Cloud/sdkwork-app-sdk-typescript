export interface ModelInfoVO {
  id: number;
  model: string;
  name: string;
  channel?: string;
  modelType?: string;
  family?: string;
  description?: string;
  contextWindow?: number;
  maxOutputTokens?: number;
  openSource?: boolean;
  status?: string;
}

export interface ModelInfoDetailVO extends ModelInfoVO {
  inputPrice?: number;
  outputPrice?: number;
  currency?: string;
  pricingUnit?: string;
  features?: string[];
  supportedMethods?: string[];
  config?: Record<string, unknown>;
}

export interface ModelPriceVO {
  model: string;
  inputPrice: number;
  outputPrice: number;
  currency: string;
  pricingUnit: string;
  cachePrice?: number;
}

export interface ModelTypeVO {
  type: string;
  name: string;
}

export interface ModelStatisticsVO {
  totalModels: number;
  activeModels: number;
  chatModels: number;
  imageModels: number;
  audioModels: number;
}

export interface ModelSearchQuery {
  keyword?: string;
  channel?: string;
  modelType?: string;
  status?: string;
  family?: string;
  openSource?: boolean;
  page?: number;
  size?: number;
}

export interface ModelModule {
  getById(modelId: number): Promise<ModelInfoDetailVO>;
  getByModel(model: string): Promise<ModelInfoDetailVO>;
  getByChannel(channel: string, page?: number, size?: number): Promise<ModelInfoVO[]>;
  getByType(modelType: string, page?: number, size?: number): Promise<ModelInfoVO[]>;
  getByFamily(family: string, page?: number, size?: number): Promise<ModelInfoVO[]>;
  getActiveModels(modelType?: string, page?: number, size?: number): Promise<ModelInfoVO[]>;
  getPopularModels(page?: number, size?: number): Promise<ModelInfoVO[]>;
  search(query: ModelSearchQuery): Promise<ModelInfoVO[]>;
  getAllFamilies(): Promise<string[]>;
  getPrice(model: string): Promise<ModelPriceVO>;
  getPrices(models: string[]): Promise<ModelPriceVO[]>;
  getTypes(): Promise<ModelTypeVO[]>;
  getStatistics(): Promise<ModelStatisticsVO>;
}
