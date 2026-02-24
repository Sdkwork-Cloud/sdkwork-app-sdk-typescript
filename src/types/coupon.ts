export interface CouponVO {
  id: string;
  name: string;
  type?: string;
  typeName?: string;
  value?: number;
  minValue?: number;
  discount?: number;
  discountLimit?: number;
  startTime?: string;
  endTime?: string;
  status?: string;
  statusName?: string;
  description?: string;
  totalCount?: number;
  usedCount?: number;
  perLimit?: number;
}

export interface UserCouponVO {
  id: string;
  couponId?: string;
  couponName?: string;
  couponType?: string;
  couponValue?: number;
  minValue?: number;
  discount?: number;
  discountLimit?: number;
  startTime?: string;
  endTime?: string;
  status?: string;
  statusName?: string;
  usedAt?: string;
  orderId?: string;
}

export interface CouponStatisticsVO {
  totalCoupons: number;
  unusedCount: number;
  usedCount: number;
  expiredCount: number;
}

export interface CouponQuery {
  type?: string;
  status?: string;
  keyword?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface UserCouponQuery {
  status?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface CouponModule {
  list(query: CouponQuery): Promise<CouponVO[]>;
  getById(couponId: string): Promise<CouponVO>;
  receive(couponId: string): Promise<UserCouponVO>;
  getMy(query: UserCouponQuery): Promise<UserCouponVO[]>;
  getAvailable(query: UserCouponQuery): Promise<UserCouponVO[]>;
  getUserCouponById(userCouponId: string): Promise<UserCouponVO>;
  use(userCouponId: string, orderId: string): Promise<UserCouponVO>;
  cancelUse(userCouponId: string): Promise<UserCouponVO>;
  getStatistics(): Promise<CouponStatisticsVO>;
}
