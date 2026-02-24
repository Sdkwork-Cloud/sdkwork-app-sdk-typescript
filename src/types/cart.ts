export interface CartItemVO {
  id: string;
  cartId?: string;
  productId?: string;
  skuId?: string;
  productName?: string;
  skuName?: string;
  productImage?: string;
  price?: string;
  quantity: number;
  selected?: boolean;
  cartGroupUuid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShoppingCartVO {
  id: string;
  uuid?: string;
  userId?: string;
  items?: CartItemVO[];
  totalCount?: number;
  selectedCount?: number;
  totalPrice?: string;
  selectedPrice?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartStatisticsVO {
  totalCount: number;
  selectedCount: number;
  totalPrice: string;
  selectedPrice: string;
}

export interface AddCartItemRequest {
  productId: string;
  skuId: string;
  quantity: number;
  cartGroupUuid?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface BatchSelectRequest {
  itemIds?: string[];
  selected: boolean;
}

export interface CartModule {
  get(): Promise<ShoppingCartVO>;
  getStatistics(): Promise<CartStatisticsVO>;
  addItem(request: AddCartItemRequest): Promise<CartItemVO>;
  updateItem(itemId: string, request: UpdateCartItemRequest): Promise<CartItemVO>;
  removeItem(itemId: string): Promise<void>;
  removeItems(itemIds: string[]): Promise<void>;
  updateItemSelection(itemId: string, selected: boolean): Promise<void>;
  batchUpdateSelection(request: BatchSelectRequest): Promise<void>;
  clear(): Promise<void>;
  getItems(): Promise<CartItemVO[]>;
  getSelectedItems(): Promise<CartItemVO[]>;
  checkItem(skuId: string): Promise<boolean>;
}
