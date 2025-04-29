import { env } from '@/env.mjs';
import pino from 'pino';

const isProduction = env.NODE_ENV === 'production';
const defaultLogLevel = env.LOG_LEVEL ?? 'info';

export const logger = pino({
  base: { pid: false },
  level: isProduction ? 'info' : defaultLogLevel,
  transport: isProduction
    ? undefined
    : {
        options: { colorize: true },
        target: 'pino-pretty',
      },
});
