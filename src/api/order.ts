import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  OrderVO,
  OrderDetailVO,
  OrderStatisticsVO,
  OrderStatusVO,
  PaymentParamsVO,
  OrderCreateRequest,
  OrderListQuery,
  OrderCancelRequest,
  OrderPayRequest,
  RefundApplyRequest,
  OrderModule,
} from '../types/order';
import type { PageResult } from '../types/common';

export class OrderApi implements OrderModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async list(query: OrderListQuery): Promise<OrderVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      status: query.status,
      page: query.page,
      size: query.size,
    };
    const result = await this.client.get<PageResult<OrderVO>>(appApiPath('/orders'), params);
    return result.content;
  }

  async getStatistics(): Promise<OrderStatisticsVO> {
    return this.client.get<OrderStatisticsVO>(appApiPath('/orders/statistics'));
  }

  async getById(orderId: string): Promise<OrderDetailVO> {
    return this.client.get<OrderDetailVO>(appApiPath(`/orders/${orderId}`));
  }

  async getStatus(orderId: string): Promise<OrderStatusVO> {
    return this.client.get<OrderStatusVO>(appApiPath(`/orders/${orderId}/status`));
  }

  async create(request: OrderCreateRequest): Promise<OrderVO> {
    return this.client.post<OrderVO>(appApiPath('/orders'), request);
  }

  async pay(orderId: string, request: OrderPayRequest): Promise<PaymentParamsVO> {
    return this.client.post<PaymentParamsVO>(appApiPath(`/orders/${orderId}/pay`), request);
  }

  async cancel(orderId: string, request: OrderCancelRequest): Promise<void> {
    await this.client.post(appApiPath(`/orders/${orderId}/cancel`), request);
  }

  async delete(orderId: string): Promise<void> {
    await this.client.delete(appApiPath(`/orders/${orderId}`));
  }

  async confirmReceipt(orderId: string): Promise<void> {
    await this.client.post(appApiPath(`/orders/${orderId}/confirm`));
  }

  async applyRefund(orderId: string, request: RefundApplyRequest): Promise<void> {
    await this.client.post(appApiPath(`/orders/${orderId}/refund`), request);
  }
}

export function createOrderApi(client: HttpClient): OrderModule {
  return new OrderApi(client);
}
