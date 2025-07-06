import { env } from '@/env.mjs';
import 'server-only';

const isDev = env.NODE_ENV === 'development';

export const generateCspHeader = ({ nonce }: { nonce: string }) => {
  return `
    default-src 'self';
    connect-src 'self' https://va.vercel-scripts.com ${isDev ? env.NEXT_PUBLIC_HOST_URL : ''} http://localhost:8000 https://localhost:* http://localhost:* https://vectorize.candlezone.eu:*;
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https: http: 'unsafe-eval';
    style-src 'self' 'unsafe-inline' data:;
    font-src 'self' data:;
    img-src 'self' blob: data: ;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `
    .replaceAll(/\s{2,}/g, ' ')
    .trim();
};
