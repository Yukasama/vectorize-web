import { env } from '@/env.mjs';
import pino from 'pino';

const isProduction = env.NODE_ENV === 'production';
const logLevel = env.LOG_LEVEL ?? 'info';

export const logger = pino({
  base: { pid: false },
  level: isProduction ? 'info' : logLevel,
  transport: isProduction
    ? undefined
    : {
        options: { colorize: true },
        target: 'pino-pretty',
      },
});
