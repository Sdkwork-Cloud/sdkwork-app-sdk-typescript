import type { HttpClient } from '../http/client';
import type {
  UserProfile,
  UserProfileUpdateRequest,
  PasswordChangeRequest,
  UserSettings,
  UserSettingsUpdateRequest,
  GenerationHistoryQuery,
  LoginHistoryQuery,
  UserModule,
} from '../types/user';
import type { ApiResult, PageResult } from '../types/common';
import { SdkworkError } from '../types/errors';
import { appApiPath } from './paths';

const SUCCESS_CODES = [0, 200, 2000];
const USER_BASE = appApiPath('/user');

export class UserApi implements UserModule {
  private client: HttpClient;
  private userId: number | null = null;

  constructor(client: HttpClient) {
    this.client = client;
  }

  setUserId(userId: number): void {
    this.userId = userId;
  }

  async getProfile(): Promise<UserProfile> {
    return this.client.get<UserProfile>(`${USER_BASE}/profile`);
  }

  async updateProfile(request: UserProfileUpdateRequest): Promise<UserProfile> {
    return this.client.put<UserProfile>(`${USER_BASE}/profile`, request);
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (this.userId !== null) {
      headers['X-User-Id'] = String(this.userId);
    }

    const response = await this.client.requestRaw(`${USER_BASE}/avatar`, {
      method: 'POST',
      headers,
      rawBody: formData,
      skipJsonContentType: true,
    });

    return this.parseApiResult<{ avatarUrl: string }>(response);
  }

  async changePassword(request: PasswordChangeRequest): Promise<void> {
    await this.client.put(`${USER_BASE}/password`, request);
  }

  async getGenerationHistory(query: GenerationHistoryQuery): Promise<PageResult<unknown>> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: query.page,
      size: query.size,
      sort: query.sort,
    };
    return this.client.get<PageResult<unknown>>(`${USER_BASE}/history/generations`, params);
  }

  async getLoginHistory(query: LoginHistoryQuery): Promise<PageResult<unknown>> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: query.page,
      size: query.size,
      sort: query.sort,
    };
    return this.client.get<PageResult<unknown>>(`${USER_BASE}/history/login`, params);
  }

  async getSettings(): Promise<UserSettings> {
    return this.client.get<UserSettings>(`${USER_BASE}/settings`);
  }

  async updateSettings(request: UserSettingsUpdateRequest): Promise<UserSettings> {
    return this.client.put<UserSettings>(`${USER_BASE}/settings`, request);
  }

  async bindThirdParty(platform: string, code: string): Promise<void> {
    await this.client.post(`${USER_BASE}/bind/${platform}`, { code });
  }

  async unbindThirdParty(platform: string): Promise<void> {
    await this.client.delete(`${USER_BASE}/bind/${platform}`);
  }

  async deactivateAccount(reason: string): Promise<void> {
    await this.client.post(`${USER_BASE}/deactivate`, { reason });
  }

  private async parseApiResult<T>(response: Response): Promise<T> {
    const result = await response.json() as ApiResult<T>;
    if (!SUCCESS_CODES.includes(result.code)) {
      throw SdkworkError.fromApiResult(result);
    }
    return result.data;
  }
}

export function createUserApi(client: HttpClient): UserModule {
  return new UserApi(client);
}
