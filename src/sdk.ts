import type { SdkworkConfig, RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './types/core';
import { HttpClient, createHttpClient } from './http/client';
import type { AuthTokenManager, AuthMode, AuthTokens } from './auth';
import type { AuthModule } from './types/auth';
import type { UserModule } from './types/user';
import type { ChatModule } from './types/chat';
import type { PaymentModule } from './types/payment';
import type { OrderModule } from './types/order';
import type { UploadModule } from './types/upload';
import type { ModelModule } from './types/model';
import type { GenerationModule } from './types/generation';
import type { ProductModule } from './types/product';
import type { VipModule } from './types/vip';
import type { AddressModule } from './types/address';
import type { CategoryModule } from './types/category';
import type { NotificationModule } from './types/notification';
import type { FavoriteModule } from './types/favorite';
import type { FeedbackModule } from './types/feedback';
import type { CartModule } from './types/cart';
import type { CouponModule } from './types/coupon';
import type { SearchModule } from './types/search';
import type { HistoryModule } from './types/history';
import type { WorkspaceModule } from './types/workspace';
import type { PromptModule } from './types/prompt';
import type { ProjectModule } from './types/project';
import type { AnalyticsModule } from './types/analytics';
import type { SettingsModule } from './types/settings';
import type { AssetsModule } from './types/assets';
import type { SocialModule } from './types/social';
import { createAuthApi } from './api/auth';
import { createUserApi } from './api/user';
import { createChatApi } from './api/chat';
import { createPaymentApi } from './api/payment';
import { createOrderApi } from './api/order';
import { createUploadApi } from './api/upload';
import { createModelApi } from './api/model';
import { createGenerationApi } from './api/generation';
import { createProductApi } from './api/product';
import { createVipApi } from './api/vip';
import { createAddressApi } from './api/address';
import { createCategoryApi } from './api/category';
import { createNotificationApi } from './api/notification';
import { createFavoriteApi } from './api/favorite';
import { createFeedbackApi } from './api/feedback';
import { createCartApi } from './api/cart';
import { createCouponApi } from './api/coupon';
import { createSearchApi } from './api/search';
import { createHistoryApi } from './api/history';
import { createWorkspaceApi } from './api/workspace';
import { createPromptApi } from './api/prompt';
import { createProjectApi } from './api/project';
import { createAnalyticsApi } from './api/analytics';
import { createSettingsApi } from './api/settings';
import { createAssetsApi } from './api/assets';
import { createSocialApi } from './api/social';

export class SdkworkClient {
  private httpClient: HttpClient;
  private modules: {
    auth: AuthModule;
    user: UserModule;
    chat: ChatModule;
    payment: PaymentModule;
    order: OrderModule;
    upload: UploadModule;
    model: ModelModule;
    generation: GenerationModule;
    product: ProductModule;
    vip: VipModule;
    address: AddressModule;
    category: CategoryModule;
    notification: NotificationModule;
    favorite: FavoriteModule;
    feedback: FeedbackModule;
    cart: CartModule;
    coupon: CouponModule;
    search: SearchModule;
    history: HistoryModule;
    workspace: WorkspaceModule;
    prompt: PromptModule;
    project: ProjectModule;
    analytics: AnalyticsModule;
    settings: SettingsModule;
    assets: AssetsModule;
    social: SocialModule;
  };

  constructor(config: SdkworkConfig) {
    this.httpClient = createHttpClient(config);
    this.modules = {
      auth: createAuthApi(this.httpClient),
      user: createUserApi(this.httpClient),
      chat: createChatApi(this.httpClient),
      payment: createPaymentApi(this.httpClient),
      order: createOrderApi(this.httpClient),
      upload: createUploadApi(this.httpClient),
      model: createModelApi(this.httpClient),
      generation: createGenerationApi(this.httpClient),
      product: createProductApi(this.httpClient),
      vip: createVipApi(this.httpClient),
      address: createAddressApi(this.httpClient),
      category: createCategoryApi(this.httpClient),
      notification: createNotificationApi(this.httpClient),
      favorite: createFavoriteApi(this.httpClient),
      feedback: createFeedbackApi(this.httpClient),
      cart: createCartApi(this.httpClient),
      coupon: createCouponApi(this.httpClient),
      search: createSearchApi(this.httpClient),
      history: createHistoryApi(this.httpClient),
      workspace: createWorkspaceApi(this.httpClient),
      prompt: createPromptApi(this.httpClient),
      project: createProjectApi(this.httpClient),
      analytics: createAnalyticsApi(this.httpClient),
      settings: createSettingsApi(this.httpClient),
      assets: createAssetsApi(this.httpClient),
      social: createSocialApi(this.httpClient),
    };
  }

  get auth(): AuthModule {
    return this.modules.auth;
  }

  get user(): UserModule {
    return this.modules.user;
  }

  get chat(): ChatModule {
    return this.modules.chat;
  }

  get payment(): PaymentModule {
    return this.modules.payment;
  }

  get order(): OrderModule {
    return this.modules.order;
  }

  get upload(): UploadModule {
    return this.modules.upload;
  }

  get model(): ModelModule {
    return this.modules.model;
  }

  get generation(): GenerationModule {
    return this.modules.generation;
  }

  get product(): ProductModule {
    return this.modules.product;
  }

  get vip(): VipModule {
    return this.modules.vip;
  }

  get address(): AddressModule {
    return this.modules.address;
  }

  get category(): CategoryModule {
    return this.modules.category;
  }

  get notification(): NotificationModule {
    return this.modules.notification;
  }

  get favorite(): FavoriteModule {
    return this.modules.favorite;
  }

  get feedback(): FeedbackModule {
    return this.modules.feedback;
  }

  get cart(): CartModule {
    return this.modules.cart;
  }

  get coupon(): CouponModule {
    return this.modules.coupon;
  }

  get search(): SearchModule {
    return this.modules.search;
  }

  get history(): HistoryModule {
    return this.modules.history;
  }

  get workspace(): WorkspaceModule {
    return this.modules.workspace;
  }

  get prompt(): PromptModule {
    return this.modules.prompt;
  }

  get project(): ProjectModule {
    return this.modules.project;
  }

  get analytics(): AnalyticsModule {
    return this.modules.analytics;
  }

  get settings(): SettingsModule {
    return this.modules.settings;
  }

  get assets(): AssetsModule {
    return this.modules.assets;
  }

  get social(): SocialModule {
    return this.modules.social;
  }

  getAuthMode(): AuthMode {
    return this.httpClient.getAuthMode();
  }

  setAuthMode(mode: AuthMode): this {
    this.httpClient.setAuthMode(mode);
    return this;
  }

  setApiKey(apiKey: string): this {
    this.httpClient.setApiKey(apiKey);
    return this;
  }

  setAuthToken(token: string): this {
    this.httpClient.setAuthToken(token);
    return this;
  }

  setAccessToken(token: string): this {
    this.httpClient.setAccessToken(token);
    return this;
  }

  setTokens(tokens: AuthTokens): this {
    const tokenManager = this.httpClient.getTokenManager();
    if (tokenManager) {
      tokenManager.setTokens(tokens);
    }
    return this;
  }

  getTokens(): AuthTokens {
    const tokenManager = this.httpClient.getTokenManager();
    return tokenManager?.getTokens() ?? {};
  }

  getTokenManager(): AuthTokenManager | undefined {
    return this.httpClient.getTokenManager();
  }

  setTokenManager(manager: AuthTokenManager): this {
    this.httpClient.setTokenManager(manager);
    return this;
  }

  setTenantId(tenantId: string): this {
    this.httpClient.setTenantId(tenantId);
    return this;
  }

  setOrganizationId(organizationId: string): this {
    this.httpClient.setOrganizationId(organizationId);
    return this;
  }

  setPlatform(platform: string): this {
    this.httpClient.setPlatform(platform);
    return this;
  }

  setUserId(userId: number): this {
    const userModule = this.modules.user as UserModule & { setUserId?: (id: number) => void };
    userModule.setUserId?.(userId);
    return this;
  }

  clearAuthToken(): this {
    this.httpClient.clearAuthToken();
    return this;
  }

  clearCache(): this {
    this.httpClient.clearCache();
    return this;
  }

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    return this.httpClient.addRequestInterceptor(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    return this.httpClient.addResponseInterceptor(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    return this.httpClient.addErrorInterceptor(interceptor);
  }

  get http(): HttpClient {
    return this.httpClient;
  }

  getConfig() {
    return this.httpClient.getConfig();
  }

  isAuthenticated(): boolean {
    const tokenManager = this.httpClient.getTokenManager();
    if (!tokenManager) {
      return false;
    }
    return tokenManager.isValid();
  }

  hasAuthToken(): boolean {
    const tokenManager = this.httpClient.getTokenManager();
    if (!tokenManager) {
      return false;
    }
    return !!tokenManager.getAuthToken();
  }

  hasAccessToken(): boolean {
    const tokenManager = this.httpClient.getTokenManager();
    if (!tokenManager) {
      return false;
    }
    return !!tokenManager.getAccessToken();
  }
}

export function createClient(config: SdkworkConfig): SdkworkClient {
  return new SdkworkClient(config);
}

export default SdkworkClient;
