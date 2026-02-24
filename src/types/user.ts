import type { PageResult } from './core';

export interface UserProfile {
  nickname?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'unknown';
  birthday?: number;
  region?: string;
  bio?: string;
  phone?: string;
  email?: string;
}

export interface UserProfileUpdateRequest {
  nickname?: string;
  gender?: string;
  bio?: string;
  phone?: string;
  email?: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserSettings {
  theme?: string;
  language?: string;
  notificationSettings?: NotificationSettings;
}

export interface NotificationSettings {
  system?: boolean;
  message?: boolean;
  activity?: boolean;
  promotion?: boolean;
  sound?: boolean;
  vibration?: boolean;
}

export interface UserSettingsUpdateRequest {
  theme?: string;
  language?: string;
  notificationSettings?: Partial<NotificationSettings>;
}

export interface GenerationHistoryQuery {
  generationType?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface LoginHistoryQuery {
  page?: number;
  size?: number;
  sort?: string;
}

export interface UserModule {
  setUserId?(userId: number): void;
  getProfile(): Promise<UserProfile>;
  updateProfile(request: UserProfileUpdateRequest): Promise<UserProfile>;
  uploadAvatar(file: File): Promise<{ avatarUrl: string }>;
  changePassword(request: PasswordChangeRequest): Promise<void>;
  getGenerationHistory(query: GenerationHistoryQuery): Promise<PageResult<unknown>>;
  getLoginHistory(query: LoginHistoryQuery): Promise<PageResult<unknown>>;
  getSettings(): Promise<UserSettings>;
  updateSettings(request: UserSettingsUpdateRequest): Promise<UserSettings>;
  bindThirdParty(platform: string, code: string): Promise<void>;
  unbindThirdParty(platform: string): Promise<void>;
  deactivateAccount(reason: string): Promise<void>;
}
