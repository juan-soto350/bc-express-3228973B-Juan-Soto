// ============================================
// PASO 2: Validación Zod para Token
// ============================================

import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createTokenSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .trim()
    .toUpperCase(),
  cantidad: z
    .number()
    .int()
    .min(1, 'La cantidad mínima es 1'),
  estado: z.enum(['activo', 'consumido', 'expirado']).default('activo'),
  player: z.string().regex(objectIdRegex, 'ID de jugador inválido'),
});

export const updateTokenSchema = createTokenSchema.partial();

export type CreateTokenDto = z.infer<typeof createTokenSchema>;
export type UpdateTokenDto = z.infer<typeof updateTokenSchema>;
