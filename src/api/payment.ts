import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  PaymentMethod,
  PaymentCreateRequest,
  Payment,
  PaymentStatusVO,
  PaymentQuery,
  PaymentStatistics,
  PaymentModule,
} from '../types/payment';
import type { PageResult } from '../types/common';

export class PaymentApi implements PaymentModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async create(request: PaymentCreateRequest): Promise<Payment> {
    return this.client.post<Payment>(appApiPath('/payments'), request);
  }

  async getDetail(paymentId: number): Promise<PaymentStatusVO> {
    return this.client.get<PaymentStatusVO>(appApiPath(`/payments/${paymentId}`));
  }

  async getStatus(paymentId: number): Promise<PaymentStatusVO> {
    return this.client.get<PaymentStatusVO>(appApiPath(`/payments/${paymentId}/status`));
  }

  async getStatusByOutTradeNo(outTradeNo: string): Promise<PaymentStatusVO> {
    return this.client.get<PaymentStatusVO>(appApiPath(`/payments/outTradeNo/${outTradeNo}/status`));
  }

  async listRecords(query: PaymentQuery): Promise<PaymentStatusVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      status: query.status,
      page: query.page,
      size: query.size,
      sort: query.sort,
    };
    const result = await this.client.get<PageResult<PaymentStatusVO>>(appApiPath('/payments/records'), params);
    return result.content;
  }

  async listOrderPayments(orderId: number): Promise<PaymentStatusVO[]> {
    return this.client.get<PaymentStatusVO[]>(appApiPath(`/payments/order/${orderId}`));
  }

  async listMethods(clientType: string = 'APP'): Promise<PaymentMethod[]> {
    return this.client.get<PaymentMethod[]>(appApiPath('/payments/methods'), { clientType });
  }

  async close(paymentId: number): Promise<void> {
    await this.client.post(appApiPath(`/payments/${paymentId}/close`));
  }

  async getStatistics(): Promise<PaymentStatistics> {
    return this.client.get<PaymentStatistics>(appApiPath('/payments/statistics'));
  }
}

export function createPaymentApi(client: HttpClient): PaymentModule {
  return new PaymentApi(client);
}
