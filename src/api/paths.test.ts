import { describe, expect, it } from 'vitest';
import { appApiPath, coreApiPath, API_PATHS, APP_API_PREFIX } from './paths';

describe('api paths', () => {
  it('should build core api paths', () => {
    expect(coreApiPath('/auth/login')).toBe('/app/v3/api/auth/login');
    expect(coreApiPath('auth/login')).toBe('/app/v3/api/auth/login');
  });

  it('should build app api paths', () => {
    expect(appApiPath('/projects')).toBe('/app/v3/api/projects');
    expect(appApiPath('projects')).toBe('/app/v3/api/projects');
  });

  it('should have correct API prefix', () => {
    expect(APP_API_PREFIX).toBe('/app/v3/api');
  });

  it('should have correct auth paths', () => {
    expect(API_PATHS.auth.base).toBe('/app/v3/api/auth');
    expect(API_PATHS.auth.login).toBe('/app/v3/api/auth/login');
    expect(API_PATHS.auth.register).toBe('/app/v3/api/auth/register');
    expect(API_PATHS.auth.logout).toBe('/app/v3/api/auth/logout');
    expect(API_PATHS.auth.refresh).toBe('/app/v3/api/auth/refresh');
    expect(API_PATHS.auth.smsSend).toBe('/app/v3/api/auth/sms/send');
    expect(API_PATHS.auth.smsVerify).toBe('/app/v3/api/auth/sms/verify');
    expect(API_PATHS.auth.passwordReset).toBe('/app/v3/api/auth/password/reset');
    expect(API_PATHS.auth.qrGenerate).toBe('/app/v3/api/auth/qr/generate');
    expect(API_PATHS.auth.qrStatus('abc123')).toBe('/app/v3/api/auth/qr/status/abc123');
    expect(API_PATHS.auth.qrConfirm).toBe('/app/v3/api/auth/qr/confirm');
    expect(API_PATHS.auth.phoneLogin).toBe('/app/v3/api/auth/phone/login');
    expect(API_PATHS.auth.oauthUrl).toBe('/app/v3/api/auth/oauth/url');
    expect(API_PATHS.auth.oauthLogin).toBe('/app/v3/api/auth/oauth/login');
  });

  it('should have correct user paths', () => {
    expect(API_PATHS.user.base).toBe('/app/v3/api/user');
    expect(API_PATHS.user.profile).toBe('/app/v3/api/user/profile');
  });
});
