import { TokenInfo } from '@/lib/next-auth/token';
import { HttpClient } from '@/lib/store/HttpClient';

export class AuthService {
  private readonly client;

  constructor(baseUrl?: string) {
    this.client = new HttpClient(baseUrl);
  }

  public async login(formData: LoginFormData) {
    const response = await this.client.request({
      url: '/login',
      method: 'POST',
      data: formData,
    });
    const tokenInfo: Partial<TokenInfo> = {
      access: response.data.data.access_token,
      refresh: response.data.data.refresh_token,
      type: response.data.data.token_type,
    };

    return new TokenInfo(tokenInfo);
  }

  public async refresh(token: string) {
    const response = await this.client.request({
      url: '/refresh-token',
      method: 'POST',
      data: {
        refresh_token: token,
      },
    });
    const tokenInfo: Partial<TokenInfo> = {
      access: response.data.data.access_token,
      refresh: response.data.data.refresh_token,
      type: response.data.data.token_type,
    };
    return new TokenInfo(tokenInfo);
  }
}
