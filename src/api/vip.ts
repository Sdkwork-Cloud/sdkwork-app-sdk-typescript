import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';
import type {
  VipInfoVO,
  VipLevelVO,
  VipBenefitVO,
  VipStatusVO,
  VipModule,
} from '../types/vip';

export class VipApi implements VipModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async getInfo(): Promise<VipInfoVO> {
    return this.client.get<VipInfoVO>(appApiPath('/vip/info'));
  }

  async getLevels(): Promise<VipLevelVO[]> {
    return this.client.get<VipLevelVO[]>(appApiPath('/vip/levels'));
  }

  async getBenefits(levelId?: number): Promise<VipBenefitVO[]> {
    const params: Record<string, string | number | boolean | undefined> = { levelId };
    return this.client.get<VipBenefitVO[]>(appApiPath('/vip/benefits'), params);
  }

  async getStatus(): Promise<VipStatusVO> {
    return this.client.get<VipStatusVO>(appApiPath('/vip/status'));
  }

  async checkVipStatus(): Promise<boolean> {
    return this.client.get<boolean>(appApiPath('/vip/check'));
  }
}

export function createVipApi(client: HttpClient): VipModule {
  return new VipApi(client);
}
