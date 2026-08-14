// ============================================
// SCHEMAS — Token (ficha)
// ============================================
import { z } from 'zod';

export const TOKEN_ESTADOS = ['activo', 'usado', 'expirado'] as const;

export const createTokenSchema = z.object({
  codigo: z.string().min(1, 'codigo es obligatorio').trim(),
  cantidad: z.number().int('cantidad debe ser un entero').nonnegative('cantidad no puede ser negativa'),
  machineId: z.number().int('machineId debe ser un entero').positive('machineId debe ser mayor a 0'),
  playerId: z.number().int('playerId debe ser un entero').positive('playerId debe ser mayor a 0'),
  estado: z.enum(TOKEN_ESTADOS).optional(),
});

export const updateTokenSchema = createTokenSchema.partial();

export type CreateTokenDto = z.infer<typeof createTokenSchema>;
export type UpdateTokenDto = z.infer<typeof updateTokenSchema>;
