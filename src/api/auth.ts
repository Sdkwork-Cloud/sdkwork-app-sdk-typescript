import type { HttpClient } from '../http/client';
import type {
  LoginRequest,
  RegisterRequest,
  TokenRefreshRequest,
  SmsCodeRequest,
  SmsCodeVerifyRequest,
  ResetPasswordRequest,
  PhoneLoginRequest,
  QrCodeGenerateResponse,
  QrCodeStatusResponse,
  QrCodeConfirmRequest,
  OAuthUrlRequest,
  OAuthUrlResponse,
  OAuthLoginRequest,
  LoginVO,
  UserInfo,
  AuthModule,
} from '../types/auth';
import { API_PATHS } from './paths';

export class AuthApi implements AuthModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async login(request: LoginRequest): Promise<LoginVO> {
    const result = await this.client.post<LoginVO>(API_PATHS.auth.login, request);
    this.handleLoginSuccess(result);
    return result;
  }

  async register(request: RegisterRequest): Promise<UserInfo> {
    return this.client.post<UserInfo>(API_PATHS.auth.register, request);
  }

  async logout(): Promise<void> {
    await this.client.post(API_PATHS.auth.logout);
    this.client.clearAuthToken();
  }

  async refreshToken(request: TokenRefreshRequest): Promise<LoginVO> {
    const result = await this.client.post<LoginVO>(API_PATHS.auth.refresh, request);
    this.handleLoginSuccess(result);
    return result;
  }

  async sendSmsCode(request: SmsCodeRequest): Promise<void> {
    await this.client.post(API_PATHS.auth.smsSend, {
      target: request.phone,
      type: request.type.toUpperCase(),
      verifyType: 'PHONE',
    });
  }

  async verifySmsCode(request: SmsCodeVerifyRequest): Promise<boolean> {
    const result = await this.client.post<{ valid: boolean }>(API_PATHS.auth.smsVerify, {
      target: request.phone,
      code: request.code,
      type: 'LOGIN',
      verifyType: 'PHONE',
    });
    return result.valid;
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await this.client.post(API_PATHS.auth.passwordReset, request);
  }

  async phoneLogin(request: PhoneLoginRequest): Promise<LoginVO> {
    const result = await this.client.post<LoginVO>(API_PATHS.auth.phoneLogin, request);
    this.handleLoginSuccess(result);
    return result;
  }

  async generateQrCode(): Promise<QrCodeGenerateResponse> {
    return this.client.post<QrCodeGenerateResponse>(API_PATHS.auth.qrGenerate);
  }

  async checkQrCodeStatus(qrKey: string): Promise<QrCodeStatusResponse> {
    return this.client.get<QrCodeStatusResponse>(API_PATHS.auth.qrStatus(qrKey));
  }

  async confirmQrCodeLogin(request: QrCodeConfirmRequest): Promise<void> {
    await this.client.post(API_PATHS.auth.qrConfirm, request);
  }

  async getOAuthUrl(request: OAuthUrlRequest): Promise<OAuthUrlResponse> {
    return this.client.post<OAuthUrlResponse>(API_PATHS.auth.oauthUrl, request);
  }

  async oauthLogin(request: OAuthLoginRequest): Promise<LoginVO> {
    const result = await this.client.post<LoginVO>(API_PATHS.auth.oauthLogin, request);
    this.handleLoginSuccess(result);
    return result;
  }

  private handleLoginSuccess(result: LoginVO): void {
    const tokenManager = this.client.getTokenManager();
    if (tokenManager && result.accessToken) {
      tokenManager.setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      });
    }
  }
}

export function createAuthApi(client: HttpClient): AuthModule {
  return new AuthApi(client);
}
