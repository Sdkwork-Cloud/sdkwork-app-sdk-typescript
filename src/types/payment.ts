export type PaymentProvider = 'WECHAT_PAY' | 'ALIPAY' | 'UNION_PAY' | 'APPLE_PAY' | 'GOOGLE_PAY';
export type PaymentProductType = 'jsapi' | 'native' | 'app' | 'h5' | 'miniapp' | 'micropay' | 'pc';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'CLOSED';

export interface PaymentMethod {
  code: string;
  methodName: string;
  icon?: string;
  available: boolean;
  sort: number;
  productTypes: PaymentProductTypeOption[];
}

export interface PaymentProductTypeOption {
  code: string;
  name: string;
  available: boolean;
}

export interface PaymentCreateRequest {
  orderId: string;
  paymentProvider: PaymentProvider;
  productType: PaymentProductType;
}

export interface Payment {
  paymentId: number;
  paymentSn: string;
  orderId: number;
  subject?: string;
  amount: string;
  paymentProvider: string;
  paymentProviderName?: string;
  productType?: string;
  productTypeName?: string;
  status: string;
  statusName?: string;
  expireTime?: string;
  createdAt?: string;
  needQuery?: boolean;
  queryInterval?: number;
  remark?: string;
  paymentParams?: Record<string, unknown>;
}

export interface PaymentStatusVO {
  paymentId: number;
  paymentSn: string;
  orderId: number;
  amount?: string;
  paymentProvider?: string;
  status: string;
  statusName?: string;
  transactionId?: string;
  outTradeNo?: string;
  successTime?: string;
  createdAt?: string;
}

export interface PaymentQuery {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaymentStatistics {
  totalPayments: number;
  pendingPayments: number;
  successPayments: number;
  failedPayments: number;
  closedPayments: number;
}

export interface PaymentModule {
  create(request: PaymentCreateRequest): Promise<Payment>;
  getDetail(paymentId: number): Promise<PaymentStatusVO>;
  getStatus(paymentId: number): Promise<PaymentStatusVO>;
  getStatusByOutTradeNo(outTradeNo: string): Promise<PaymentStatusVO>;
  listRecords(query: PaymentQuery): Promise<PaymentStatusVO[]>;
  listOrderPayments(orderId: number): Promise<PaymentStatusVO[]>;
  listMethods(clientType?: string): Promise<PaymentMethod[]>;
  close(paymentId: number): Promise<void>;
  getStatistics(): Promise<PaymentStatistics>;
}
