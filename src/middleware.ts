import { NextRequest, NextResponse } from 'next/server';
import { generateCspHeader } from './config/csp-header';

export const middleware = (req: NextRequest) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = generateCspHeader({ nonce });

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
};

export const config = {
  matcher: [
    {
      missing: [
        { key: 'next-router-prefetch', type: 'header' },
        { key: 'purpose', type: 'header', value: 'prefetch' },
      ],
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    },
  ],
};
