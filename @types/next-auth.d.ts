import 'next-auth';

declare module 'next-auth' {
  interface User {
    email: string;
    token: string;
    refreshToken: string;
    tokenType: string;
  }

  interface Session {
    access: string;
    refresh: string;
    user?: {
      email: string;
      sub: string;
      aud?: string;
      exp: number;
      id: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    email: string;
    token: string;
    refreshToken: string;
    tokenType: string;
  }
}
