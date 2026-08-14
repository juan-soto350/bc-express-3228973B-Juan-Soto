// ============================================
// CONFIG — logger de Winston + stream para Morgan
// ============================================
import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';

const isDev = process.env['NODE_ENV'] !== 'production';

const devFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
  level: isDev ? 'http' : 'warn',
  format: format.combine(
    format.timestamp(),
    isDev ? format.combine(format.colorize(), devFormat) : format.json()
  ),
  transports: [
    new transports.Console(),
    ...(isDev ? [] : [new transports.File({ filename: 'logs/error.log', level: 'error' })]),
  ],
});

// Stream que redirige los logs de Morgan hacia Winston (nivel http)
export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

const morganFormat = isDev ? 'dev' : 'combined';

export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
