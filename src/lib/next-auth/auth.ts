import NextAuth, { Session, User } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';

import { JWT } from 'next-auth/jwt';
import { AuthService } from '@/services/auth-service';
import { TokenInfo } from './token';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null;
        try {
          const apiService = new AuthService();
          const response = await apiService.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });
          return response as any;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      const newToken: any = { ...token };
      if (user && account) {
        Object.assign(newToken, user);
      }
      if (Date.now() < newToken.claims.exp * 1000) {
        return newToken;
      }
      const tokenInfo = await refreshToken(newToken.refreshToken);
      Object.assign(newToken, tokenInfo);
      return newToken;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: any | TokenInfo | JWT;
      user: User;
    }) {
  
      if (token) {
        const tokenInfo: TokenInfo = token;
        if (tokenInfo.claims.exp * 1000 > Date.now()) {
          session.user = tokenInfo.claims;
          session.access = tokenInfo.access;
          session.refresh = tokenInfo.refresh;
        } else {
          const refreshTokenInfo = await refreshToken(tokenInfo.refresh);
          Object.assign(tokenInfo, refreshTokenInfo);
          if (tokenInfo) {
            session.user = tokenInfo.claims;
            session.access = tokenInfo.access;
            session.refresh = tokenInfo.refresh;
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

async function refreshToken(token: string) {
  const apiService = new AuthService();
  return await apiService.refresh(token);
}
