import { env } from '@/env.mjs';
import 'server-only';

const isDev = env.NODE_ENV === 'development';

export const generateCspHeader = ({ nonce }: { nonce: string }) => {
  return `
    default-src 'self';
    connect-src 'self' https://va.vercel-scripts.com ${isDev ? env.NEXT_PUBLIC_HOST_URL : ''};
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https: http: ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replaceAll(/\s{2,}/g, ' ')
    .trim();
};
