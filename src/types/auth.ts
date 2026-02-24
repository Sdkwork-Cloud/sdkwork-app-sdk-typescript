export interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
  captchaKey?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  captcha?: string;
  captchaKey?: string;
  inviteCode?: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

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
}
