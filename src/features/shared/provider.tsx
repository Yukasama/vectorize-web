'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

/**
 * Provider wraps the app with QueryClientProvider and ThemeProvider.
 * Sets up React Query and theme context for all children.
 */
interface Props extends PropsWithChildren {
  nonce?: string;
}

export const Provider = ({ children, nonce }: Readonly<Props>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 10,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" disableTransitionOnChange nonce={nonce}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
