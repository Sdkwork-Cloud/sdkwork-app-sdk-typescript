import type { HttpClient } from '../http/client';
import type {
  AnalyticsModule,
  EventTrackForm,
  BatchEventTrackForm,
  PageViewTrackForm,
  ErrorTrackForm,
  UserUsageStatsVO,
  UserActivityVO,
  AiUsageStatsVO,
  RetentionAnalysisVO,
  EventStatsVO,
  TopEventVO,
  EventTrendVO,
  FunnelAnalysisVO,
  PathAnalysisVO,
  ConversionPathVO,
  DeviceDistributionVO,
  ChannelAnalysisVO,
  RealtimeOnlineVO,
  RealtimeEventVO,
  ExportResultVO,
  ReportTypeVO,
  UserActivityQueryForm,
  EventStatsQueryForm,
  EventTrendQueryForm,
  FunnelQueryForm,
  PathAnalysisQueryForm,
  ChannelQueryForm,
  StatsExportForm,
} from '../types/analytics';
import { appApiPath } from './paths';

const ANALYTICS_BASE = appApiPath('/analytics');

export class AnalyticsApi implements AnalyticsModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async trackEvent(data: EventTrackForm): Promise<void> {
    await this.http.post(`${ANALYTICS_BASE}/events`, data);
  }

  async batchTrackEvents(data: BatchEventTrackForm): Promise<void> {
    await this.http.post(`${ANALYTICS_BASE}/events/batch`, data);
  }

  async trackPageView(data: PageViewTrackForm): Promise<void> {
    await this.http.post(`${ANALYTICS_BASE}/pageview`, data);
  }

  async trackError(data: ErrorTrackForm): Promise<void> {
    await this.http.post(`${ANALYTICS_BASE}/errors`, data);
  }

  async getUserUsageStats(): Promise<UserUsageStatsVO> {
    return this.http.get(`${ANALYTICS_BASE}/usage`);
  }

  async getUserActivity(query: UserActivityQueryForm): Promise<UserActivityVO> {
    return this.http.get(`${ANALYTICS_BASE}/activity`, query);
  }

  async getAiUsageStats(startDate?: string, endDate?: string): Promise<AiUsageStatsVO> {
    return this.http.get(`${ANALYTICS_BASE}/ai-usage`, { startDate, endDate });
  }

  async getRetentionAnalysis(period?: string): Promise<RetentionAnalysisVO> {
    return this.http.get(`${ANALYTICS_BASE}/retention`, { period });
  }

  async getEventStats(query: EventStatsQueryForm): Promise<EventStatsVO> {
    return this.http.get(`${ANALYTICS_BASE}/events/stats`, query);
  }

  async getTopEvents(limit: number = 10): Promise<TopEventVO[]> {
    return this.http.get(`${ANALYTICS_BASE}/events/top`, { limit });
  }

  async getEventTrend(query: EventTrendQueryForm): Promise<EventTrendVO> {
    return this.http.get(`${ANALYTICS_BASE}/events/trend`, query);
  }

  async getFunnelAnalysis(query: FunnelQueryForm): Promise<FunnelAnalysisVO> {
    return this.http.get(`${ANALYTICS_BASE}/funnel`, query);
  }

  async getPathAnalysis(query: PathAnalysisQueryForm): Promise<PathAnalysisVO> {
    return this.http.get(`${ANALYTICS_BASE}/path`, query);
  }

  async getConversionPath(targetEvent: string): Promise<ConversionPathVO> {
    return this.http.get(`${ANALYTICS_BASE}/conversion-path`, { targetEvent });
  }

  async getDeviceDistribution(): Promise<DeviceDistributionVO> {
    return this.http.get(`${ANALYTICS_BASE}/devices`);
  }

  async getChannelAnalysis(query: ChannelQueryForm): Promise<ChannelAnalysisVO> {
    return this.http.get(`${ANALYTICS_BASE}/channels`, query);
  }

  async getRealtimeOnline(): Promise<RealtimeOnlineVO> {
    return this.http.get(`${ANALYTICS_BASE}/realtime/online`);
  }

  async getRealtimeEvents(limit: number = 20): Promise<RealtimeEventVO[]> {
    return this.http.get(`${ANALYTICS_BASE}/realtime/events`, { limit });
  }

  async exportStats(data: StatsExportForm): Promise<ExportResultVO> {
    return this.http.post(`${ANALYTICS_BASE}/export`, data);
  }

  async listReportTypes(): Promise<ReportTypeVO[]> {
    return this.http.get(`${ANALYTICS_BASE}/reports`);
  }
}

export function createAnalyticsApi(http: HttpClient): AnalyticsModule {
  return new AnalyticsApi(http);
}
