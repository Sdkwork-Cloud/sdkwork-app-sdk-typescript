export interface VipInfoVO {
  vipLevel: number;
  vipLevelName: string;
  vipStatus: string;
  effectiveTime?: string;
  expireTime?: string;
  remainingDays?: number;
  vipPoints: number;
  benefits?: VipBenefitVO[];
}

export interface VipLevelVO {
  id: number;
  name: string;
  levelValue: number;
  requiredPoints?: number;
  description?: string;
  icon?: string;
  color?: string;
}

export interface VipBenefitVO {
  id: number;
  name: string;
  benefitKey: string;
  type?: string;
  description?: string;
  icon?: string;
}

export interface VipStatusVO {
  isVip: boolean;
  vipLevel: number;
  expireTime?: string;
  pointBalance: number;
}

export interface VipModule {
  getInfo(): Promise<VipInfoVO>;
  getLevels(): Promise<VipLevelVO[]>;
  getBenefits(levelId?: number): Promise<VipBenefitVO[]>;
  getStatus(): Promise<VipStatusVO>;
  checkVipStatus(): Promise<boolean>;
}
