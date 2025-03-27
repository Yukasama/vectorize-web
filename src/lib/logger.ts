import { env } from '@/env.mjs';
import pino from 'pino';

const isProduction = env.NODE_ENV === 'production';

export const logger = pino({
  base: { pid: false },
  level: isProduction ? 'info' : env.LOG_LEVEL ?? 'info',
  transport: isProduction
    ? undefined
    : {
        options: { colorize: true },
        target: 'pino-pretty',
      },
});
