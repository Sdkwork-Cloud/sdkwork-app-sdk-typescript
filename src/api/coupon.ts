import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  CouponVO,
  UserCouponVO,
  CouponStatisticsVO,
  CouponQuery,
  UserCouponQuery,
  CouponModule,
} from '../types/coupon';
import type { PageResult } from '../types/common';

export class CouponApi implements CouponModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async list(query: CouponQuery): Promise<CouponVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      type: query.type,
      status: query.status,
      keyword: query.keyword,
      pageNum: query.pageNum,
      pageSize: query.pageSize,
    };
    const result = await this.client.get<PageResult<CouponVO>>(appApiPath('/coupons'), params);
    return result.content;
  }

  async getById(couponId: string): Promise<CouponVO> {
    return this.client.get<CouponVO>(appApiPath(`/coupons/${couponId}`));
  }

  async receive(couponId: string): Promise<UserCouponVO> {
    return this.client.post<UserCouponVO>(appApiPath(`/coupons/${couponId}/receive`));
  }

  async getMy(query: UserCouponQuery): Promise<UserCouponVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      status: query.status,
      pageNum: query.pageNum,
      pageSize: query.pageSize,
    };
    const result = await this.client.get<PageResult<UserCouponVO>>(appApiPath('/coupons/my'), params);
    return result.content;
  }

  async getAvailable(query: UserCouponQuery): Promise<UserCouponVO[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      status: query.status,
      pageNum: query.pageNum,
      pageSize: query.pageSize,
    };
    const result = await this.client.get<PageResult<UserCouponVO>>(appApiPath('/coupons/my/available'), params);
    return result.content;
  }

  async getUserCouponById(userCouponId: string): Promise<UserCouponVO> {
    return this.client.get<UserCouponVO>(appApiPath(`/coupons/my/${userCouponId}`));
  }

  async use(userCouponId: string, orderId: string): Promise<UserCouponVO> {
    return this.client.post<UserCouponVO>(appApiPath(`/coupons/my/${userCouponId}/use`), undefined, { orderId });
  }

  async cancelUse(userCouponId: string): Promise<UserCouponVO> {
    return this.client.post<UserCouponVO>(appApiPath(`/coupons/my/${userCouponId}/cancel`));
  }

  async getStatistics(): Promise<CouponStatisticsVO> {
    return this.client.get<CouponStatisticsVO>(appApiPath('/coupons/statistics'));
  }
}

export function createCouponApi(client: HttpClient): CouponModule {
  return new CouponApi(client);
}
