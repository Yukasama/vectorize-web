import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // eslint-disable-next-line @typescript-eslint/require-await
  headers: async () => [
    {
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: 'https://vectorize.candlezone.eu',
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
  images: {
    remotePatterns: [
      {
        hostname: 'github.githubassets.com',
        protocol: 'https',
      },
      {
        hostname: 'huggingface.co',
        protocol: 'https',
      },
    ],
  },
  output: 'standalone',
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
