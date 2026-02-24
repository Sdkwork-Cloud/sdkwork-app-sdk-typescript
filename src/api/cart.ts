import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  CartItemVO,
  ShoppingCartVO,
  CartStatisticsVO,
  AddCartItemRequest,
  UpdateCartItemRequest,
  BatchSelectRequest,
  CartModule,
} from '../types/cart';

export class CartApi implements CartModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async get(): Promise<ShoppingCartVO> {
    return this.client.get<ShoppingCartVO>(appApiPath('/cart'));
  }

  async getStatistics(): Promise<CartStatisticsVO> {
    return this.client.get<CartStatisticsVO>(appApiPath('/cart/statistics'));
  }

  async addItem(request: AddCartItemRequest): Promise<CartItemVO> {
    return this.client.post<CartItemVO>(appApiPath('/cart/items'), request);
  }

  async updateItem(itemId: string, request: UpdateCartItemRequest): Promise<CartItemVO> {
    return this.client.put<CartItemVO>(appApiPath(`/cart/items/${itemId}`), request);
  }

  async removeItem(itemId: string): Promise<void> {
    await this.client.delete(appApiPath(`/cart/items/${itemId}`));
  }

  async removeItems(itemIds: string[]): Promise<void> {
    await this.client.delete(appApiPath('/cart/items'), undefined, { itemIds: itemIds.join(',') });
  }

  async updateItemSelection(itemId: string, selected: boolean): Promise<void> {
    await this.client.put(appApiPath(`/cart/items/${itemId}/select`), undefined, { selected });
  }

  async batchUpdateSelection(request: BatchSelectRequest): Promise<void> {
    await this.client.put(appApiPath('/cart/items/select'), request);
  }

  async clear(): Promise<void> {
    await this.client.delete(appApiPath('/cart'));
  }

  async getItems(): Promise<CartItemVO[]> {
    return this.client.get<CartItemVO[]>(appApiPath('/cart/items'));
  }

  async getSelectedItems(): Promise<CartItemVO[]> {
    return this.client.get<CartItemVO[]>(appApiPath('/cart/items/selected'));
  }

  async checkItem(skuId: string): Promise<boolean> {
    return this.client.get<boolean>(appApiPath('/cart/check'), { skuId });
  }
}

export function createCartApi(client: HttpClient): CartModule {
  return new CartApi(client);
}
