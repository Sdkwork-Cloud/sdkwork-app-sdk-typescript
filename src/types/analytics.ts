import type { BasePlusVO } from './common';

export interface EventTrackForm {
  eventName: string;
  eventType?: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
}

export interface BatchEventTrackForm {
  events: EventTrackForm[];
}

export interface PageViewTrackForm {
  pageUrl: string;
  pageTitle?: string;
  referrer?: string;
  duration?: number;
  scrollDepth?: number;
}

export interface ErrorTrackForm {
  errorType: string;
  errorMessage: string;
  errorStack?: string;
  pageUrl?: string;
  userAgent?: string;
  timestamp?: string;
}

export interface UserUsageStatsVO extends BasePlusVO {
  totalSessions: number;
  totalDuration: number;
  totalGenerations: number;
  totalMessages: number;
  totalFilesUploaded: number;
  avgSessionDuration: number;
  mostUsedFeatures: FeatureUsageVO[];
  dailyUsage: DailyUsageVO[];
}

export interface FeatureUsageVO {
  feature: string;
  count: number;
  percentage: number;
}

export interface DailyUsageVO {
  date: string;
  sessions: number;
  duration: number;
  generations: number;
}

export interface UserActivityVO extends BasePlusVO {
  activeDays: number;
  totalDays: number;
  activityRate: number;
  streakDays: number;
  longestStreak: number;
  activityCalendar: ActivityDayVO[];
}

export interface ActivityDayVO {
  date: string;
  active: boolean;
  count: number;
}

export interface AiUsageStatsVO extends BasePlusVO {
  totalRequests: number;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  modelUsage: ModelUsageVO[];
  dailyUsage: DailyAiUsageVO[];
}

export interface ModelUsageVO {
  model: string;
  requests: number;
  tokens: number;
  cost: number;
}

export interface DailyAiUsageVO {
  date: string;
  requests: number;
  tokens: number;
  cost: number;
}

export interface RetentionAnalysisVO extends BasePlusVO {
  period: string;
  cohorts: CohortVO[];
  averageRetention: number;
}

export interface CohortVO {
  cohortDate: string;
  users: number;
  retention: number[];
}

export interface EventStatsVO extends BasePlusVO {
  eventName: string;
  totalCount: number;
  uniqueUsers: number;
  avgPerUser: number;
  trend: TrendPointVO[];
}

export interface TrendPointVO {
  date: string;
  count: number;
}

export interface TopEventVO extends BasePlusVO {
  eventName: string;
  count: number;
  uniqueUsers: number;
  percentage: number;
}

export interface EventTrendVO extends BasePlusVO {
  eventName: string;
  granularity: string;
  data: TrendPointVO[];
}

export interface FunnelAnalysisVO extends BasePlusVO {
  funnelName: string;
  steps: FunnelStepVO[];
  conversionRate: number;
  dropOffRate: number;
}

export interface FunnelStepVO {
  stepName: string;
  eventName: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface PathAnalysisVO extends BasePlusVO {
  startEvent: string;
  paths: PathNodeVO[];
  totalUsers: number;
}

export interface PathNodeVO {
  eventName: string;
  users: number;
  percentage: number;
  nextNodes: PathNodeVO[];
}

export interface ConversionPathVO extends BasePlusVO {
  targetEvent: string;
  paths: ConversionPathNodeVO[];
  avgSteps: number;
  avgDuration: number;
}

export interface ConversionPathNodeVO {
  eventName: string;
  users: number;
  percentage: number;
}

export interface DeviceDistributionVO extends BasePlusVO {
  devices: DeviceStatVO[];
  browsers: BrowserStatVO[];
  os: OsStatVO[];
}

export interface DeviceStatVO {
  device: string;
  count: number;
  percentage: number;
}

export interface BrowserStatVO {
  browser: string;
  count: number;
  percentage: number;
}

export interface OsStatVO {
  os: string;
  count: number;
  percentage: number;
}

export interface ChannelAnalysisVO extends BasePlusVO {
  channels: ChannelStatVO[];
  topChannels: ChannelStatVO[];
  conversionByChannel: ChannelConversionVO[];
}

export interface ChannelStatVO {
  channel: string;
  users: number;
  percentage: number;
}

export interface ChannelConversionVO {
  channel: string;
  conversions: number;
  conversionRate: number;
}

export interface RealtimeOnlineVO extends BasePlusVO {
  onlineUsers: number;
  peakToday: number;
  peakTime: string;
  trend: RealtimeTrendVO[];
}

export interface RealtimeTrendVO {
  time: string;
  users: number;
}

export interface RealtimeEventVO extends BasePlusVO {
  eventName: string;
  userId?: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

export interface ExportResultVO extends BasePlusVO {
  exportId: string;
  status: string;
  downloadUrl?: string;
  expiresAt?: string;
}

export interface ReportTypeVO extends BasePlusVO {
  reportType: string;
  reportName: string;
  description?: string;
  frequency?: string;
}

export interface UserActivityQueryForm {
  startDate?: string;
  endDate?: string;
}

export interface EventStatsQueryForm {
  eventName: string;
  startDate?: string;
  endDate?: string;
  granularity?: string;
}

export interface EventTrendQueryForm {
  eventName: string;
  startDate?: string;
  endDate?: string;
  granularity?: string;
}

export interface FunnelQueryForm {
  funnelName?: string;
  steps: string[];
  startDate?: string;
  endDate?: string;
}

export interface PathAnalysisQueryForm {
  startEvent: string;
  maxDepth?: number;
  startDate?: string;
  endDate?: string;
}

export interface ChannelQueryForm {
  startDate?: string;
  endDate?: string;
}

export interface StatsExportForm {
  reportType: string;
  startDate: string;
  endDate: string;
  format?: string;
  includeDetails?: boolean;
}

export interface AnalyticsModule {
  trackEvent(data: EventTrackForm): Promise<void>;
  batchTrackEvents(data: BatchEventTrackForm): Promise<void>;
  trackPageView(data: PageViewTrackForm): Promise<void>;
  trackError(data: ErrorTrackForm): Promise<void>;

  getUserUsageStats(): Promise<UserUsageStatsVO>;
  getUserActivity(query: UserActivityQueryForm): Promise<UserActivityVO>;
  getAiUsageStats(startDate?: string, endDate?: string): Promise<AiUsageStatsVO>;
  getRetentionAnalysis(period?: string): Promise<RetentionAnalysisVO>;

  getEventStats(query: EventStatsQueryForm): Promise<EventStatsVO>;
  getTopEvents(limit?: number): Promise<TopEventVO[]>;
  getEventTrend(query: EventTrendQueryForm): Promise<EventTrendVO>;
  getFunnelAnalysis(query: FunnelQueryForm): Promise<FunnelAnalysisVO>;

  getPathAnalysis(query: PathAnalysisQueryForm): Promise<PathAnalysisVO>;
  getConversionPath(targetEvent: string): Promise<ConversionPathVO>;

  getDeviceDistribution(): Promise<DeviceDistributionVO>;
  getChannelAnalysis(query: ChannelQueryForm): Promise<ChannelAnalysisVO>;

  getRealtimeOnline(): Promise<RealtimeOnlineVO>;
  getRealtimeEvents(limit?: number): Promise<RealtimeEventVO[]>;

  exportStats(data: StatsExportForm): Promise<ExportResultVO>;
  listReportTypes(): Promise<ReportTypeVO[]>;
}
