import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import ReduxWrapper from '@/lib/providers/ReduxWrapper';
import NextAuthSessionProvider from '@/lib/providers/NextAuthSessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next 14.2.6 boiler plate',
  description: 'provided by @jsunnykhan2@gmail.com',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxWrapper>
      <html lang="en">
        <body className={inter.className}>
          <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
        </body>
      </html>
    </ReduxWrapper>
  );
}
