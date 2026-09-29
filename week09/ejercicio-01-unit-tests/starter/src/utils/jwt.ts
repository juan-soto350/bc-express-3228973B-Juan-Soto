import jwt from 'jsonwebtoken';
import type { TokenPayload } from '../types/index.js';

const ACCESS_SECRET  = process.env['JWT_ACCESS_SECRET']  ?? 'fallback-access-secret';
const REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] ?? 'fallback-refresh-secret';
const ACCESS_EXP     = process.env['JWT_ACCESS_EXPIRES_IN']  ?? '15m';
const REFRESH_EXP    = process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d';

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXP } as jwt.SignOptions);
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}
