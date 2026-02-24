export interface OrderVO {
  id: string;
  orderSn: string;
  orderType: string;
  status: string;
  statusName: string;
  totalAmount?: string;
  paidAmount?: string;
  discountAmount?: string;
  itemCount?: number;
  createdAt?: string;
  paidAt?: string;
}

export interface OrderDetailVO extends OrderVO {
  items?: OrderItemVO[];
  receiverInfo?: ReceiverInfoVO;
  paymentInfo?: PaymentInfoVO;
}

export interface OrderItemVO {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  skuId?: string;
  skuName?: string;
  quantity: number;
  price: string;
  totalPrice: string;
}

export interface ReceiverInfoVO {
  name?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
}

export interface PaymentInfoVO {
  paymentMethod?: string;
  paymentMethodName?: string;
  paidAmount?: string;
  paidAt?: string;
  transactionId?: string;
}

export interface OrderStatisticsVO {
  totalOrders: number;
  pendingPayment: number;
  completed: number;
  totalAmount: string;
}

export interface OrderStatusVO {
  orderId: string;
  status: string;
  statusName: string;
  expireTime?: number;
}

export interface PaymentParamsVO {
  orderId: string;
  amount: string;
  paymentMethod: string;
}

export interface OrderCreateRequest {
  orderType: string;
  productId: string;
  quantity?: number;
  rechargePoints?: number;
  addressId?: string;
  remark?: string;
}

export interface OrderListQuery {
  status?: string;
  page?: number;
  size?: number;
}

export interface OrderCancelRequest {
  reason?: string;
}

export interface OrderPayRequest {
  paymentMethod: string;
}

export interface RefundApplyRequest {
  reason: string;
}

export interface OrderModule {
  list(query: OrderListQuery): Promise<OrderVO[]>;
  getStatistics(): Promise<OrderStatisticsVO>;
  getById(orderId: string): Promise<OrderDetailVO>;
  getStatus(orderId: string): Promise<OrderStatusVO>;
  create(request: OrderCreateRequest): Promise<OrderVO>;
  pay(orderId: string, request: OrderPayRequest): Promise<PaymentParamsVO>;
  cancel(orderId: string, request: OrderCancelRequest): Promise<void>;
  delete(orderId: string): Promise<void>;
  confirmReceipt(orderId: string): Promise<void>;
  applyRefund(orderId: string, request: RefundApplyRequest): Promise<void>;
}
