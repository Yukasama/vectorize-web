import { Provider } from '@/features/shared/provider';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import type { PropsWithChildren } from 'react';
import { constructMetadata } from '../lib/metadata';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = constructMetadata();
export const viewport = {
  themeColor: [
    { color: 'white', media: '(prefers-color-scheme: light)' },
    { color: 'black', media: '(prefers-color-scheme: dark)' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const headerList = await headers();
  const nonce = headerList.get('x-nonce');

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <Provider nonce={nonce ?? undefined}>
          <main className="min-h-screen">{children}</main>
        </Provider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
