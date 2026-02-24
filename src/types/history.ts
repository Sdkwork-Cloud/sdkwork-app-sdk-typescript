import type { BasePlusVO, PageResult } from './common';

export interface BrowseHistoryVO extends BasePlusVO {
  id: string;
  type: string;
  targetId: string;
  targetName: string;
  targetDescription?: string;
  targetIcon?: string;
  browseTime: string;
  duration?: number;
  source?: string;
}

export interface OperationHistoryVO extends BasePlusVO {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  detail?: string;
  ipAddress?: string;
  userAgent?: string;
  operatedAt: string;
}

export interface GenerationHistoryVO extends BasePlusVO {
  id: string;
  type: string;
  modelId?: string;
  modelName?: string;
  prompt?: string;
  result?: string;
  resultUrl?: string;
  thumbnailUrl?: string;
  status: string;
  duration?: number;
  tokensUsed?: number;
  cost?: number;
  createdAt: string;
}

export interface LoginHistoryVO extends BasePlusVO {
  id: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  location?: string;
  device: string;
  browser?: string;
  os?: string;
  status: string;
  loginType?: string;
}

export interface SessionInfoVO extends BasePlusVO {
  sessionId: string;
  device: string;
  browser?: string;
  os?: string;
  ipAddress: string;
  location?: string;
  loginTime: string;
  lastActiveTime: string;
  isCurrent: boolean;
}

export interface HistoryStatisticsVO extends BasePlusVO {
  totalBrowseCount: number;
  totalOperationCount: number;
  totalGenerationCount: number;
  totalLoginCount: number;
  todayBrowseCount: number;
  todayOperationCount: number;
  todayGenerationCount: number;
  todayLoginCount: number;
  weeklyBrowseCount: number;
  weeklyOperationCount: number;
  weeklyGenerationCount: number;
  weeklyLoginCount: number;
}

export interface BrowseStatisticsVO extends BasePlusVO {
  totalCount: number;
  todayCount: number;
  weeklyCount: number;
  monthlyCount: number;
  topTypes: TypeCountVO[];
  recentTrend: DailyCountVO[];
}

export interface TypeCountVO {
  type: string;
  count: number;
}

export interface DailyCountVO {
  date: string;
  count: number;
}

export interface BrowseHistoryQueryForm {
  type?: string;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface BrowseHistoryAddForm {
  type: string;
  targetId: string;
  targetName?: string;
  targetDescription?: string;
  targetIcon?: string;
  duration?: number;
  source?: string;
}

export interface HistoryBatchDeleteForm {
  historyIds: string[];
}

export interface OperationHistoryQueryForm {
  action?: string;
  targetType?: string;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface GenerationHistoryQueryForm {
  type?: string;
  modelId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface LoginHistoryQueryForm {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface HistoryModule {
  listBrowseHistory(query: BrowseHistoryQueryForm): Promise<PageResult<BrowseHistoryVO>>;
  addBrowseHistory(data: BrowseHistoryAddForm): Promise<void>;
  deleteBrowseHistory(historyId: string): Promise<void>;
  batchDeleteBrowseHistory(data: HistoryBatchDeleteForm): Promise<void>;
  clearBrowseHistory(type?: string): Promise<void>;

  listOperationHistory(query: OperationHistoryQueryForm): Promise<PageResult<OperationHistoryVO>>;
  getRecentOperations(action?: string, limit?: number): Promise<OperationHistoryVO[]>;

  listGenerationHistory(query: GenerationHistoryQueryForm): Promise<PageResult<GenerationHistoryVO>>;
  getRecentGenerations(type?: string, limit?: number): Promise<GenerationHistoryVO[]>;
  deleteGenerationHistory(historyId: string): Promise<void>;
  clearGenerationHistory(): Promise<void>;

  listLoginHistory(query: LoginHistoryQueryForm): Promise<PageResult<LoginHistoryVO>>;
  getCurrentSession(): Promise<SessionInfoVO>;
  listSessions(): Promise<SessionInfoVO[]>;
  terminateSession(sessionId: string): Promise<void>;
  terminateOtherSessions(): Promise<void>;

  getHistoryStatistics(): Promise<HistoryStatisticsVO>;
  getBrowseStatistics(): Promise<BrowseStatisticsVO>;
}
