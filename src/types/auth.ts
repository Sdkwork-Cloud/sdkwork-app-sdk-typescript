export interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
  captchaKey?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
  phone?: string;
  inviteCode?: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface SmsCodeRequest {
  phone: string;
  type: 'login' | 'register' | 'reset_password' | 'bind_email' | 'bind_phone';
}

export interface SmsCodeVerifyRequest {
  phone: string;
  code: string;
}

export interface ResetPasswordRequest {
  account: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PhoneLoginRequest {
  phone: string;
  code: string;
  deviceId?: string;
  deviceType?: 'ios' | 'android' | 'web' | 'mini_program' | 'pc';
  deviceName?: string;
  appVersion?: string;
}

export interface QrCodeLoginRequest {
  qrKey: string;
}

export interface QrCodeConfirmRequest {
  qrKey: string;
  token: string;
}

export interface QrCodeStatusResponse {
  status: 'pending' | 'scanned' | 'confirmed' | 'expired';
  userInfo?: UserInfo;
  token?: LoginVO;
}

export interface QrCodeGenerateResponse {
  qrKey: string;
  qrUrl?: string;
  qrContent?: string;
  expireTime: number;
}

export interface OAuthUrlRequest {
  provider: OAuthProvider;
  redirectUri?: string;
  scope?: string;
  state?: string;
}

export interface OAuthUrlResponse {
  authUrl: string;
}

export interface OAuthLoginRequest {
  provider: OAuthProvider;
  code: string;
  state?: string;
  deviceId?: string;
  deviceType?: 'ios' | 'android' | 'web';
}

export type OAuthProvider = 'WECHAT' | 'WECHAT_MINI' | 'QQ' | 'GITHUB' | 'GOOGLE' | 'APPLE';

export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  status?: string;
  createdAt?: string;
}

export interface LoginVO {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo: UserInfo;
}

export interface AuthModule {
  login(request: LoginRequest): Promise<LoginVO>;
  register(request: RegisterRequest): Promise<UserInfo>;
  logout(): Promise<void>;
  refreshToken(request: TokenRefreshRequest): Promise<LoginVO>;
  sendSmsCode(request: SmsCodeRequest): Promise<void>;
  verifySmsCode(request: SmsCodeVerifyRequest): Promise<boolean>;
  resetPassword(request: ResetPasswordRequest): Promise<void>;
  phoneLogin(request: PhoneLoginRequest): Promise<LoginVO>;
  generateQrCode(): Promise<QrCodeGenerateResponse>;
  checkQrCodeStatus(qrKey: string): Promise<QrCodeStatusResponse>;
  confirmQrCodeLogin(request: QrCodeConfirmRequest): Promise<void>;
  getOAuthUrl(request: OAuthUrlRequest): Promise<OAuthUrlResponse>;
  oauthLogin(request: OAuthLoginRequest): Promise<LoginVO>;
}
