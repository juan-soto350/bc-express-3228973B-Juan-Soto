import 'dotenv/config';

export const env = {
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  JWT_ACCESS_SECRET: process.env['JWT_ACCESS_SECRET'] ?? 'test-access-secret',
  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] ?? 'test-refresh-secret',
  JWT_ACCESS_EXPIRES_IN: process.env['JWT_ACCESS_EXPIRES_IN'] ?? '15m',
  JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  MONGODB_URI: process.env['MONGODB_URI'] ?? '',
} as const;
