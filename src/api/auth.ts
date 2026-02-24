import type { HttpClient } from '../http/client';
import type {
  LoginRequest,
  RegisterRequest,
  TokenRefreshRequest,
  LoginVO,
  UserInfo,
  AuthModule,
} from '../types/auth';
import { appApiPath } from './paths';

const AUTH_BASE = appApiPath('/auth');

export class AuthApi implements AuthModule {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async login(request: LoginRequest): Promise<LoginVO> {
    return this.client.post<LoginVO>(`${AUTH_BASE}/login`, request);
  }

  async register(request: RegisterRequest): Promise<UserInfo> {
    return this.client.post<UserInfo>(`${AUTH_BASE}/register`, request);
  }

  async logout(): Promise<void> {
    await this.client.post(`${AUTH_BASE}/logout`);
  }

  async refreshToken(request: TokenRefreshRequest): Promise<LoginVO> {
    return this.client.post<LoginVO>(`${AUTH_BASE}/refresh`, request);
  }
}

export function createAuthApi(client: HttpClient): AuthModule {
  return new AuthApi(client);
}
