// src/schemas/player.schema.ts — Validación Zod para Player

import { z } from 'zod';

export const PLAYER_NIVELES = ['principiante', 'intermedio', 'experto'] as const;

export const createPlayerSchema = z.object({
  alias: z.string().min(1, 'alias es obligatorio').trim(),
  nombre: z.string().min(1, 'nombre es obligatorio').trim(),
  edad: z
    .number()
    .int('edad debe ser un entero')
    .min(0, 'edad no puede ser negativa')
    .max(120, 'edad debe ser menor o igual a 120'),
  nivel: z.enum(PLAYER_NIVELES).optional(),
});

export const updatePlayerSchema = createPlayerSchema.partial();

export type CreatePlayerDto = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerDto = z.infer<typeof updatePlayerSchema>;
