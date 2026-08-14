// src/config/logger.ts — Logger Winston + stream para Morgan

import morgan from 'morgan';
import winston from 'winston';

const isDev = process.env['NODE_ENV'] !== 'production';

export const logger = winston.createLogger({
  level: isDev ? 'http' : 'warn',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isDev
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
          })
        )
      : winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    ...(isDev ? [] : [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]),
  ],
});

export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

const morganFormat = isDev ? 'dev' : 'combined';

export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
