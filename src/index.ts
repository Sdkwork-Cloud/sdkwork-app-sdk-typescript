export { SdkworkClient, createClient } from './sdk';
export { HttpClient, createHttpClient } from './http/client';

export type {
  SdkworkConfig,
  ApiResult,
  PageResult,
  RequestOptions,
  HttpMethod,
  LogLevel,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  RequestConfig,
  RetryConfig,
  CacheConfig,
  LoggerConfig,
  Interceptors,
  DeepPartial,
  PickByType,
  RequiredByKeys,
  OptionalByKeys,
} from './types/core';

export {
  SdkworkError,
  NetworkError,
  TimeoutError,
  AuthenticationError,
  TokenExpiredError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  CancelledError,
  isSdkworkError,
  isNetworkError,
  isAuthError,
  isRetryableError,
} from './types/errors';

export type { ErrorCode, ErrorDetail } from './types/errors';

export { 
  createLogger, 
  noopLogger, 
  createCacheStore, 
  generateCacheKey,
  withRetry, 
  sleep, 
  calculateDelay, 
  createRetryConfig, 
  DEFAULT_RETRY_CONFIG,
  type Logger,
  type CacheStore,
} from '@sdkwork/sdk-common';

export { BaseApi, createApiConfig } from './api/base';
export type { BaseApiConfig } from './api/base';
export { coreApiPath, appApiPath, CORE_API_PREFIX, APP_API_PREFIX } from './api/paths';

export { EventEmitter, createEventEmitter } from './utils/events';
export type { EventHandler, EventMap } from './utils/events';

export { RequestManager, createRequestManager } from './utils/request-manager';
export type { PendingRequest, RequestQueueOptions } from './utils/request-manager';

export { 
  FileUploader, 
  ChunkUploader, 
  createFileUploader, 
  createChunkUploader,
  getFileExtension,
  getMimeType,
} from './utils/upload';
export type { 
  UploadOptions, 
  UploadProgress, 
  ChunkUploadOptions, 
  ChunkInfo 
} from './utils/upload';

export { WebSocketClient, createWebSocketClient } from './utils/websocket';
export type { 
  WebSocketState, 
  WebSocketOptions as WebSocketClientOptions, 
  WebSocketMessage 
} from './utils/websocket';

export { 
  pluginManager, 
  createPlugin, 
  usePlugin 
} from './utils/plugins';
export type { 
  Plugin, 
  PluginContext, 
  PluginConfig, 
  PluginManager 
} from './utils/plugins';

export { 
  reactive, 
  computed, 
  watchEffect, 
  watch 
} from './utils/reactive';
export type { 
  ReactiveValue, 
  ComputedValue, 
  Subscriber, 
  ReactiveOptions 
} from './utils/reactive';

export { 
  createLocalStorage,
  createSessionStorage,
  createMemoryStorage,
  localStorage,
  sessionStorage,
  memoryStorage,
} from './utils/storage';
export type { StorageAdapter, StorageOptions } from './utils/storage';

export { 
  getEnvironment,
  isBrowser,
  isNode,
  isWebWorker,
  isServiceWorker,
  supportsFeature,
} from './utils/environment';
export type { EnvironmentInfo } from './utils/environment';

export { 
  createPerformanceMonitor,
  measureAsync,
  measureSync,
  getNavigationTiming,
  PerformanceMonitor,
} from './utils/performance';
export type { 
  PerformanceMetrics, 
  ResourceTiming, 
  PerformanceMonitorOptions 
} from './utils/performance';

export {
  RequestDeduplicator,
  createRequestDeduplicator,
  debounce as debounceRequest,
  throttle as throttleRequest,
  memoize,
  once,
  retry as retryUtil,
} from './utils/request-utils';
export type { 
  DebounceOptions, 
  ThrottleOptions, 
} from './utils/request-utils';

export {
  md5,
  sha256,
  sha512,
  simpleHash,
  hmacSha256,
  base64Encode,
  base64Decode,
  base64UrlEncode,
  base64UrlDecode,
  generateUUID,
  generateShortId,
  generateNanoId,
  generateAESKey,
  encryptAES,
  decryptAES,
  hashPassword,
  verifyPassword,
  generateToken,
  obfuscate,
  deobfuscate,
} from './utils/crypto';

export {
  MockClient,
  createMockClient,
  mockResponse,
  mockError,
  mockList,
  mockPaginate,
  mockRandom,
  mockRandomInt,
  mockRandomFloat,
  mockRandomBoolean,
  mockRandomString,
  mockRandomEmail,
  mockRandomPhone,
  mockRandomDate,
  mockRandomUuid,
  mockPersonName,
  mockCompanyName,
  mockAddress,
  mockLoremIpsum,
} from './utils/mock';
export type { MockHandler, MockConfig } from './utils/mock';

export {
  pipe,
  compose,
  curry,
  partial,
  flip,
  negate,
  tap,
  identity,
  always,
  noop,
  T as T_,
  F as F_,
  when,
  unless,
  ifElse,
  cond,
  until,
  memoizeWith,
  once as onceFn,
  before,
  after,
  only,
  debounceFn,
  throttleFn,
  ary,
  unary,
  binary,
  nAry,
  rearg,
} from './utils/fp';
export type { Pipe, Compose } from './utils/fp';

export {
  DefaultAuthTokenManager,
  createTokenManager,
} from './auth';

export type {
  AuthTokenManager,
  AuthTokens,
  TokenManagerEvents,
  AuthMode,
  AuthConfig,
} from './auth';

export { StringUtils, Encoding } from '@sdkwork/sdk-common/utils';

export type {
  LoginRequest,
  RegisterRequest,
  TokenRefreshRequest,
  UserInfo,
  LoginVO,
  AuthModule,
} from './types/auth';

export type {
  UserProfile,
  UserProfileUpdateRequest,
  PasswordChangeRequest,
  UserSettings,
  NotificationSettings,
  UserSettingsUpdateRequest,
  GenerationHistoryQuery,
  LoginHistoryQuery,
  UserModule,
} from './types/user';

export type {
  ChatSession,
  ChatSessionDetail,
  ChatSessionSettings,
  ChatSessionCreateRequest,
  ChatSessionUpdateRequest,
  ChatSessionQuery,
  ChatMessage,
  ChatMessageSendRequest,
  ChatMessageQuery,
  ChatExportRequest,
  ChatExportVO,
  ChatModule,
} from './types/chat';

export type {
  PaymentProvider,
  PaymentProductType,
  PaymentStatus,
  PaymentMethod,
  PaymentProductTypeOption,
  PaymentCreateRequest,
  Payment,
  PaymentStatusVO,
  PaymentQuery,
  PaymentStatistics,
  PaymentModule,
} from './types/payment';

export type {
  OrderVO,
  OrderDetailVO,
  OrderItemVO,
  ReceiverInfoVO,
  PaymentInfoVO,
  OrderStatisticsVO,
  OrderStatusVO,
  PaymentParamsVO,
  OrderCreateRequest,
  OrderListQuery,
  OrderCancelRequest,
  OrderPayRequest,
  RefundApplyRequest,
  OrderModule,
} from './types/order';

export type {
  FileVO,
  UploadInitVO,
  UploadChunkVO,
  PresignedUrlVO,
  UploadCredentialsVO,
  UploadPolicyVO,
  StorageUsageVO,
  UploadInitRequest,
  PresignedUrlRequest,
  UploadModule,
} from './types/upload';

export type {
  ModelInfoVO,
  ModelInfoDetailVO,
  ModelPriceVO,
  ModelTypeVO,
  ModelStatisticsVO,
  ModelSearchQuery,
  ModelModule,
} from './types/model';

export type {
  GenerationTaskVO,
  ImageGenerationRequest,
  ImageVariationRequest,
  ImageEditRequest,
  ImageUpscaleRequest,
  VideoGenerationRequest,
  ImageToVideoRequest,
  VideoExtendRequest,
  VideoStyleTransferRequest,
  MusicGenerationRequest,
  MusicExtendRequest,
  MusicRemixRequest,
  MusicSimilarRequest,
  MusicStylesQuery,
  MusicStylesVO,
  AudioTTSRequest,
  AudioTranscriptionRequest,
  AudioTranslationRequest,
  VoiceCloneRequest,
  VoiceListQuery,
  VoiceListVO,
  GenerationModule,
} from './types/generation';

export type {
  ProductVO,
  ProductDetailVO,
  SkuVO,
  SkuSpecVO,
  ProductStatisticsVO,
  ProductQuery,
  ProductModule,
} from './types/product';

export type {
  VipInfoVO,
  VipLevelVO,
  VipBenefitVO,
  VipStatusVO,
  VipModule,
} from './types/vip';

export type {
  UserAddressVO,
  UserAddressCreateRequest,
  UserAddressUpdateRequest,
  AddressModule,
} from './types/address';

export type {
  CategoryVO,
  CategoryTreeVO,
  CategoryDetailVO,
  CategoryTypeVO,
  TagVO,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryMoveRequest,
  CategorySortRequest,
  TagCreateRequest,
  CategoryQuery,
  CategoryModule,
} from './types/category';

export type {
  NotificationVO,
  NotificationDetailVO,
  NotificationTypeVO,
  NotificationSettingsVO,
  NotificationTypeSettingsVO,
  DeviceVO,
  NotificationQuery,
  NotificationBatchReadRequest,
  NotificationBatchDeleteRequest,
  NotificationSettingsUpdateRequest,
  NotificationTypeSettingsRequest,
  DeviceRegisterRequest,
  TopicSubscribeRequest,
  TestNotificationRequest,
  NotificationModule,
} from './types/notification';

export type {
  FavoriteVO,
  FavoriteItemVO,
  FavoriteDetailVO,
  FavoriteFolderVO,
  FavoriteCheckVO,
  FavoriteStatisticsVO,
  FavoriteTypeCountVO,
  FavoriteAddRequest,
  FavoriteQuery,
  FavoriteBatchRemoveRequest,
  FavoriteBatchCheckRequest,
  FavoriteFolderCreateRequest,
  FavoriteFolderUpdateRequest,
  FavoriteMoveRequest,
  FavoriteBatchMoveRequest,
  FavoriteModule,
} from './types/favorite';

export type {
  FeedbackVO,
  FeedbackDetailVO,
  FeedbackFollowUpVO,
  ReportVO,
  ReportDetailVO,
  FaqCategoryVO,
  FaqVO,
  FaqDetailVO,
  TutorialVO,
  TutorialDetailVO,
  OnboardingStepVO,
  SupportInfoVO,
  SupportMessageVO,
  FeedbackSubmitRequest,
  FeedbackQuery,
  FeedbackFollowUpRequest,
  ReportSubmitRequest,
  ReportQuery,
  FaqQuery,
  TutorialQuery,
  SupportMessageRequest,
  SupportMessageQuery,
  FeedbackModule,
} from './types/feedback';

export type {
  CartItemVO,
  ShoppingCartVO,
  CartStatisticsVO,
  AddCartItemRequest,
  UpdateCartItemRequest,
  BatchSelectRequest,
  CartModule,
} from './types/cart';

export type {
  CouponVO,
  UserCouponVO,
  CouponStatisticsVO,
  CouponQuery,
  UserCouponQuery,
  CouponModule,
} from './types/coupon';

export type {
  GlobalSearchVO,
  SearchResult,
  SearchFacet,
  SearchFacetValue,
  SearchSuggestionVO,
  HotSearchVO,
  SearchHistoryVO,
  ProjectSearchResult,
  AssetSearchResult,
  NoteSearchResult,
  UserSearchResult,
  GlobalSearchRequest,
  ProjectSearchRequest,
  AssetSearchRequest,
  NoteSearchRequest,
  UserSearchRequest,
  AdvancedSearchRequest,
  SearchFiltersVO,
  SearchFilterOption,
  SearchStatisticsVO,
  SearchHistoryAddRequest,
  SearchModule,
} from './types/search';

export type {
  BrowseHistoryVO,
  OperationHistoryVO,
  GenerationHistoryVO,
  LoginHistoryVO,
  SessionInfoVO,
  HistoryStatisticsVO,
  BrowseStatisticsVO,
  TypeCountVO,
  DailyCountVO,
  BrowseHistoryQueryForm,
  BrowseHistoryAddForm,
  HistoryBatchDeleteForm,
  OperationHistoryQueryForm,
  GenerationHistoryQueryForm,
  LoginHistoryQueryForm,
  HistoryModule,
} from './types/history';

export type {
  WorkspaceVO,
  WorkspaceSettings,
  WorkspaceCreateForm,
  WorkspaceUpdateForm,
  ProjectVO as WorkspaceProjectVO,
  ProjectDetailVO as WorkspaceProjectDetailVO,
  ProjectStatisticsVO as WorkspaceProjectStatisticsVO,
  ProjectQueryForm,
  ProjectCreateForm,
  ProjectUpdateForm,
  ProjectMoveForm,
  ProjectCopyForm,
  MemberVO,
  MemberInviteForm,
  MemberRoleUpdateForm,
  WorkspaceModule,
} from './types/workspace';

export type {
  PromptType,
  PromptBizType,
  PromptVO,
  TagsContent,
  PromptHistoryVO,
  PromptQueryForm,
  PromptCreateForm,
  PromptUpdateForm,
  PromptHistoryQueryForm,
  PromptModule,
} from './types/prompt';

export type {
  ProjectType,
  ProjectStatus,
  ProjectVO,
  ProjectDetailVO,
  ProjectStatisticsVO,
  ProjectListQueryRequest,
  ProjectSearchRequest as ProjectSearchRequestType,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectMoveRequest,
  ProjectCopyRequest,
  ProjectModule,
} from './types/project';

export type {
  EventTrackForm,
  BatchEventTrackForm,
  PageViewTrackForm,
  ErrorTrackForm,
  UserUsageStatsVO,
  FeatureUsageVO,
  DailyUsageVO,
  UserActivityVO,
  ActivityDayVO,
  AiUsageStatsVO,
  ModelUsageVO,
  DailyAiUsageVO,
  RetentionAnalysisVO,
  CohortVO,
  EventStatsVO,
  TrendPointVO,
  TopEventVO,
  EventTrendVO,
  FunnelAnalysisVO,
  FunnelStepVO,
  PathAnalysisVO,
  PathNodeVO,
  ConversionPathVO,
  ConversionPathNodeVO,
  DeviceDistributionVO,
  DeviceStatVO,
  BrowserStatVO,
  OsStatVO,
  ChannelAnalysisVO,
  ChannelStatVO,
  ChannelConversionVO,
  RealtimeOnlineVO,
  RealtimeTrendVO,
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
  AnalyticsModule,
} from './types/analytics';

export type {
  UISettingsVO,
  PrivacySettingsVO,
  SecuritySettingsVO,
  TrustedDeviceVO,
  AppConfigVO,
  AppVersionVO,
  TwoFactorSetupVO,
  DataExportVO,
  SettingsUpdateForm,
  UISettingsUpdateForm,
  ThemeSwitchForm,
  LanguageSwitchForm,
  PrivacySettingsUpdateForm,
  SecuritySettingsUpdateForm,
  PasswordChangeForm,
  TwoFactorToggleForm,
  DataExportForm,
  AccountDeleteForm,
  SettingsModule,
} from './types/settings';

export type {
  AssetType,
  AssetVO,
  AssetDetailVO,
  AssetMediaResource,
  DownloadUrlVO,
  FolderVO,
  AssetStatisticsVO,
  AssetListForm,
  AssetDownloadForm,
  AssetMoveForm,
  AssetRenameForm,
  FolderCreateForm,
  AssetsModule,
} from './types/assets';

export type {
  FollowVO,
  FollowUserVO,
  FollowStatsVO,
  FollowCheckVO,
  BatchFollowCheckForm,
  PrivateMessageVO,
  ConversationVO,
  MessageUnreadCountVO,
  BlockedUserVO,
  BlockCheckVO,
  FollowQueryForm,
  SendMessageForm,
  ConversationQueryForm,
  MessageQueryForm,
  BlockedUserQueryForm,
  SocialModule,
} from './types/social';

export { createAuthApi, AuthApi } from './api/auth';
export { createUserApi, UserApi } from './api/user';
export { createChatApi, ChatApi } from './api/chat';
export { createPaymentApi, PaymentApi } from './api/payment';
export { createOrderApi, OrderApi } from './api/order';
export { createUploadApi, UploadApi } from './api/upload';
export { createModelApi, ModelApi } from './api/model';
export { createGenerationApi, GenerationApi } from './api/generation';
export { createProductApi, ProductApi } from './api/product';
export { createVipApi, VipApi } from './api/vip';
export { createAddressApi, AddressApi } from './api/address';
export { createCategoryApi, CategoryApi } from './api/category';
export { createNotificationApi, NotificationApi } from './api/notification';
export { createFavoriteApi, FavoriteApi } from './api/favorite';
export { createFeedbackApi, FeedbackApi } from './api/feedback';
export { createCartApi, CartApi } from './api/cart';
export { createCouponApi, CouponApi } from './api/coupon';
export { createSearchApi, SearchApi } from './api/search';
export { createHistoryApi, HistoryApi } from './api/history';
export { createWorkspaceApi, WorkspaceApi } from './api/workspace';
export { createPromptApi, PromptApi } from './api/prompt';
export { createProjectApi, ProjectApi } from './api/project';
export { createAnalyticsApi, AnalyticsApi } from './api/analytics';
export { createSettingsApi, SettingsApi } from './api/settings';
export { createAssetsApi, AssetsApi } from './api/assets';
export { createSocialApi, SocialApi } from './api/social';

import { SdkworkClient } from './sdk';
export { SdkworkClient as default };
