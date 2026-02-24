export interface ProductVO {
  id: string;
  code?: string;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  stock?: number;
  sales?: number;
  mainImage?: string;
  images?: string[];
  categoryId?: string;
  categoryName?: string;
  status: string;
  createdAt?: string;
}

export interface ProductDetailVO extends ProductVO {
  content?: string;
  skus?: SkuVO[];
  attributes?: Record<string, string>;
}

export interface SkuVO {
  id: string;
  productId: string;
  skuCode?: string;
  name: string;
  price: string;
  originalPrice?: string;
  stock: number;
  sales?: number;
  image?: string;
  specs?: SkuSpecVO[];
  status: string;
}

export interface SkuSpecVO {
  name: string;
  value: string;
}

export interface ProductStatisticsVO {
  productId: string;
  skuCount: number;
  totalStock: number;
  totalSales: number;
}

export interface ProductQuery {
  keyword?: string;
  categoryId?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface ProductModule {
  list(query: ProductQuery): Promise<ProductVO[]>;
  getById(productId: string): Promise<ProductDetailVO>;
  getSkus(productId: string, status?: number): Promise<SkuVO[]>;
  getStatistics(productId: string): Promise<ProductStatisticsVO>;
  getHotProducts(limit?: number): Promise<ProductVO[]>;
  getLatestProducts(limit?: number): Promise<ProductVO[]>;
  getByCategory(categoryId: string, page?: number, size?: number, status?: string): Promise<ProductVO[]>;
  search(keyword: string, page?: number, size?: number, categoryId?: string): Promise<ProductVO[]>;
  getByCode(code: string): Promise<ProductVO>;
  getStock(productId: string): Promise<number>;
  checkStock(productId: string, quantity: number): Promise<boolean>;
}
