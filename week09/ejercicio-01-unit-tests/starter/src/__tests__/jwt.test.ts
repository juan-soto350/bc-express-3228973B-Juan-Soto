// ============================================================
// UNIT TESTS — utils/jwt.ts
// ============================================================
// Tests de roundtrip de nuestros propios utilitarios JWT:
// firmar → verificar devuelve el payload original.
// (No se testea la librería jsonwebtoken en sí, solo su uso.)
// ============================================================

import { signAccessToken, signRefreshToken, verifyAccessToken } from '../utils/jwt';
import type { TokenPayload } from '../types';

const payload: TokenPayload = { sub: 'user-id-abc123', role: 'user' };

describe('JWT Utils — Unit Tests', () => {
  it('should sign and verify an access token roundtrip', () => {
    const token = signAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.role).toBe(payload.role);
  });

  it('should sign a refresh token as a valid JWT string', () => {
    const token = signRefreshToken(payload);

    expect(typeof token).toBe('string');
    // Un JWT tiene 3 segmentos separados por punto
    expect(token.split('.')).toHaveLength(3);
  });

  it('should throw when verifying a malformed token', () => {
    expect(() => verifyAccessToken('no-es-un-token')).toThrow();
  });
});

export {};
