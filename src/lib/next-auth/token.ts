export interface TokenClaims {
  sub: string;
  exp: number;
  aud: string;
  id: string;
  email: string;
}

interface JwtToken {
  aud?: string;
  email?: string;
  exp?: number;
  iat?: number;
  id?: string;
  iss?: string;
  sub?: string;
}

export class TokenInfo {
  access: string;
  refresh: string;
  type: string;
  private aud: string;
  private email: string;
  private exp: number;
  private iat: number;
  private id: string;
  private iss: string;
  private sub: string;
  claims: TokenClaims;

  constructor(data: Partial<TokenInfo>) {
    this.refresh = data.refresh ?? '';
    this.type = data.type ?? '';
    this.access = data.access ?? '';
    const user = this.parseJwt(this.access);

    this.aud = user.aud ?? '';
    this.email = user.email ?? '';
    this.exp = user.exp ?? 0;
    this.iat = user.iat ?? 0;
    this.id = user.id ?? '';
    this.iss = user.iss ?? '';
    this.sub = user.sub ?? '';
    this.claims = <TokenClaims>{
      email: this.email,
      id: this.id,
      exp: this.exp,
      sub: this.sub,
      aud: this.aud,
    };
  }

  private parseJwt(token: string): JwtToken {
    if (!token) return {};
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
