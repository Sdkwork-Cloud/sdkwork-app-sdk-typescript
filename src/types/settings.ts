import type { BasePlusVO } from './common';

export interface UISettingsVO extends BasePlusVO {
  theme: string;
  language: string;
  fontSize: string;
  sidebarCollapsed: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
  customColors?: Record<string, string>;
}

export interface PrivacySettingsVO extends BasePlusVO {
  profileVisibility: string;
  showOnlineStatus: boolean;
  showActivity: boolean;
  allowMessages: boolean;
  allowMentions: boolean;
  dataCollection: boolean;
  personalizedAds: boolean;
}

export interface SecuritySettingsVO extends BasePlusVO {
  twoFactorEnabled: boolean;
  twoFactorMethod?: string;
  loginNotifications: boolean;
  sessionTimeout: number;
  trustedDevices: TrustedDeviceVO[];
}

export interface TrustedDeviceVO extends BasePlusVO {
  deviceId: string;
  deviceName: string;
  lastUsed: string;
  location?: string;
  isCurrent: boolean;
}

export interface AppConfigVO extends BasePlusVO {
  appName: string;
  appVersion: string;
  apiVersion: string;
  environment: string;
  features: Record<string, boolean>;
  config: Record<string, unknown>;
}

export interface AppVersionVO extends BasePlusVO {
  currentVersion: string;
  latestVersion: string;
  updateRequired: boolean;
  updateUrl?: string;
  releaseNotes?: string;
  releaseDate?: string;
}

export interface TwoFactorSetupVO extends BasePlusVO {
  enabled: boolean;
  method?: string;
  secret?: string;
  qrCodeUrl?: string;
  backupCodes?: string[];
}

export interface DataExportVO extends BasePlusVO {
  exportId: string;
  status: string;
  format: string;
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface SettingsUpdateForm {
  settings: Record<string, unknown>;
}

export interface UISettingsUpdateForm {
  theme?: string;
  language?: string;
  fontSize?: string;
  sidebarCollapsed?: boolean;
  compactMode?: boolean;
  animationsEnabled?: boolean;
  highContrast?: boolean;
  customColors?: Record<string, string>;
}

export interface ThemeSwitchForm {
  theme: string;
}

export interface LanguageSwitchForm {
  language: string;
}

export interface PrivacySettingsUpdateForm {
  profileVisibility?: string;
  showOnlineStatus?: boolean;
  showActivity?: boolean;
  allowMessages?: boolean;
  allowMentions?: boolean;
  dataCollection?: boolean;
  personalizedAds?: boolean;
}

export interface SecuritySettingsUpdateForm {
  loginNotifications?: boolean;
  sessionTimeout?: number;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorToggleForm {
  enable: boolean;
  method?: string;
  code?: string;
}

export interface DataExportForm {
  format: string;
  includeFiles?: boolean;
  includeHistory?: boolean;
  includeSettings?: boolean;
}

export interface AccountDeleteForm {
  password: string;
  reason?: string;
  confirmDelete: boolean;
}

export interface SettingsModule {
  getAllSettings(): Promise<Record<string, unknown>>;
  getModuleSettings(module: string): Promise<Record<string, unknown>>;
  updateModuleSettings(module: string, data: SettingsUpdateForm): Promise<void>;
  resetModuleSettings(module: string): Promise<void>;
  resetAllSettings(): Promise<void>;

  getUISettings(): Promise<UISettingsVO>;
  updateUISettings(data: UISettingsUpdateForm): Promise<void>;
  switchTheme(data: ThemeSwitchForm): Promise<void>;
  switchLanguage(data: LanguageSwitchForm): Promise<void>;

  getPrivacySettings(): Promise<PrivacySettingsVO>;
  updatePrivacySettings(data: PrivacySettingsUpdateForm): Promise<void>;

  getSecuritySettings(): Promise<SecuritySettingsVO>;
  updateSecuritySettings(data: SecuritySettingsUpdateForm): Promise<void>;
  changePassword(data: PasswordChangeForm): Promise<void>;
  toggleTwoFactor(data: TwoFactorToggleForm): Promise<TwoFactorSetupVO>;

  getAppConfig(): Promise<AppConfigVO>;
  getFeatureFlags(): Promise<Record<string, boolean>>;
  getAppVersion(platform: string, currentVersion: string): Promise<AppVersionVO>;

  exportUserData(data: DataExportForm): Promise<DataExportVO>;
  deleteAccount(data: AccountDeleteForm): Promise<void>;
  clearCache(): Promise<void>;
  clearLocalData(): Promise<void>;
}
