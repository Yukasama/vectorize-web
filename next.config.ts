import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // eslint-disable-next-line @typescript-eslint/require-await
  headers: async () => [
    {
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          // TODO: Change this to the actual domain
          value: 'https://nextjs-template.com',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
      source: '/(.*)',
    },
  ],
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
