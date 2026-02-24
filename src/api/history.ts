import type { HttpClient } from '../http/client';
import type {
  HistoryModule,
  BrowseHistoryVO,
  OperationHistoryVO,
  GenerationHistoryVO,
  LoginHistoryVO,
  SessionInfoVO,
  HistoryStatisticsVO,
  BrowseStatisticsVO,
  BrowseHistoryQueryForm,
  BrowseHistoryAddForm,
  HistoryBatchDeleteForm,
  OperationHistoryQueryForm,
  GenerationHistoryQueryForm,
  LoginHistoryQueryForm,
} from '../types/history';
import type { PageResult } from '../types/common';
import { appApiPath } from './paths';

const HISTORY_BASE = appApiPath('/history');

export class HistoryApi implements HistoryModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async listBrowseHistory(query: BrowseHistoryQueryForm): Promise<PageResult<BrowseHistoryVO>> {
    return this.http.get(`${HISTORY_BASE}/browse`, query);
  }

  async addBrowseHistory(data: BrowseHistoryAddForm): Promise<void> {
    await this.http.post(`${HISTORY_BASE}/browse`, data);
  }

  async deleteBrowseHistory(historyId: string): Promise<void> {
    await this.http.delete(`${HISTORY_BASE}/browse/${historyId}`);
  }

  async batchDeleteBrowseHistory(data: HistoryBatchDeleteForm): Promise<void> {
    await this.http.delete(`${HISTORY_BASE}/browse/batch`, { data });
  }

  async clearBrowseHistory(type?: string): Promise<void> {
    await this.http.delete(`${HISTORY_BASE}/browse`, undefined, { type });
  }

  async listOperationHistory(query: OperationHistoryQueryForm): Promise<PageResult<OperationHistoryVO>> {
    return this.http.get(`${HISTORY_BASE}/operations`, query);
  }

  async getRecentOperations(action?: string, limit: number = 20): Promise<OperationHistoryVO[]> {
    return this.http.get(`${HISTORY_BASE}/operations/recent`, { action, limit });
  }

  async listGenerationHistory(query: GenerationHistoryQueryForm): Promise<PageResult<GenerationHistoryVO>> {
    return this.http.get(`${HISTORY_BASE}/generations`, query);
  }

  async getRecentGenerations(type?: string, limit: number = 10): Promise<GenerationHistoryVO[]> {
    return this.http.get(`${HISTORY_BASE}/generations/recent`, { type, limit });
  }

  async deleteGenerationHistory(historyId: string): Promise<void> {
    await this.http.delete(`${HISTORY_BASE}/generations/${historyId}`);
  }

  async clearGenerationHistory(): Promise<void> {
    await this.http.delete(`${HISTORY_BASE}/generations`);
  }

  async listLoginHistory(query: LoginHistoryQueryForm): Promise<PageResult<LoginHistoryVO>> {
    return this.http.get(`${HISTORY_BASE}/logins`, query);
  }

  async getCurrentSession(): Promise<SessionInfoVO> {
    return this.http.get(`${HISTORY_BASE}/sessions/current`);
  }

  async listSessions(): Promise<SessionInfoVO[]> {
    return this.http.get(`${HISTORY_BASE}/sessions`);
  }

  async terminateSession(sessionId: string): Promise<void> {
    await this.http.delete(`${HISTORY_BASE}/sessions/${sessionId}`);
  }

  async terminateOtherSessions(): Promise<void> {
    await this.http.delete(`${HISTORY_BASE}/sessions/others`);
  }

  async getHistoryStatistics(): Promise<HistoryStatisticsVO> {
    return this.http.get(`${HISTORY_BASE}/statistics`);
  }

  async getBrowseStatistics(): Promise<BrowseStatisticsVO> {
    return this.http.get(`${HISTORY_BASE}/statistics/browse`);
  }
}

export function createHistoryApi(http: HttpClient): HistoryModule {
  return new HistoryApi(http);
}
