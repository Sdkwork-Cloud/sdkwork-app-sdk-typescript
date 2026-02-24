import type { HttpClient } from '../http/client';
import type {
  SettingsModule,
  UISettingsVO,
  PrivacySettingsVO,
  SecuritySettingsVO,
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
} from '../types/settings';
import { appApiPath } from './paths';

const SETTINGS_BASE = appApiPath('/settings');

export class SettingsApi implements SettingsModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async getAllSettings(): Promise<Record<string, unknown>> {
    return this.http.get(SETTINGS_BASE);
  }

  async getModuleSettings(module: string): Promise<Record<string, unknown>> {
    return this.http.get(`${SETTINGS_BASE}/${module}`);
  }

  async updateModuleSettings(module: string, data: SettingsUpdateForm): Promise<void> {
    await this.http.put(`${SETTINGS_BASE}/${module}`, data);
  }

  async resetModuleSettings(module: string): Promise<void> {
    await this.http.delete(`${SETTINGS_BASE}/${module}`);
  }

  async resetAllSettings(): Promise<void> {
    await this.http.delete(SETTINGS_BASE);
  }

  async getUISettings(): Promise<UISettingsVO> {
    return this.http.get(`${SETTINGS_BASE}/ui`);
  }

  async updateUISettings(data: UISettingsUpdateForm): Promise<void> {
    await this.http.put(`${SETTINGS_BASE}/ui`, data);
  }

  async switchTheme(data: ThemeSwitchForm): Promise<void> {
    await this.http.put(`${SETTINGS_BASE}/ui/theme`, data);
  }

  async switchLanguage(data: LanguageSwitchForm): Promise<void> {
    await this.http.put(`${SETTINGS_BASE}/ui/language`, data);
  }

  async getPrivacySettings(): Promise<PrivacySettingsVO> {
    return this.http.get(`${SETTINGS_BASE}/privacy`);
  }

  async updatePrivacySettings(data: PrivacySettingsUpdateForm): Promise<void> {
    await this.http.put(`${SETTINGS_BASE}/privacy`, data);
  }

  async getSecuritySettings(): Promise<SecuritySettingsVO> {
    return this.http.get(`${SETTINGS_BASE}/security`);
  }

  async updateSecuritySettings(data: SecuritySettingsUpdateForm): Promise<void> {
    await this.http.put(`${SETTINGS_BASE}/security`, data);
  }

  async changePassword(data: PasswordChangeForm): Promise<void> {
    await this.http.put(`${SETTINGS_BASE}/security/password`, data);
  }

  async toggleTwoFactor(data: TwoFactorToggleForm): Promise<TwoFactorSetupVO> {
    return this.http.put(`${SETTINGS_BASE}/security/2fa`, data);
  }

  async getAppConfig(): Promise<AppConfigVO> {
    return this.http.get(`${SETTINGS_BASE}/app/config`);
  }

  async getFeatureFlags(): Promise<Record<string, boolean>> {
    return this.http.get(`${SETTINGS_BASE}/app/features`);
  }

  async getAppVersion(platform: string, currentVersion: string): Promise<AppVersionVO> {
    return this.http.get(`${SETTINGS_BASE}/app/version`, { platform, currentVersion });
  }

  async exportUserData(data: DataExportForm): Promise<DataExportVO> {
    return this.http.post(`${SETTINGS_BASE}/data/export`, data);
  }

  async deleteAccount(data: AccountDeleteForm): Promise<void> {
    await this.http.delete(`${SETTINGS_BASE}/account`, data);
  }

  async clearCache(): Promise<void> {
    await this.http.delete(`${SETTINGS_BASE}/cache`);
  }

  async clearLocalData(): Promise<void> {
    await this.http.delete(`${SETTINGS_BASE}/data/local`);
  }
}

export function createSettingsApi(http: HttpClient): SettingsModule {
  return new SettingsApi(http);
}
