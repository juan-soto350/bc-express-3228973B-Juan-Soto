import { z } from 'zod';

export const createPlayerSchema = z.object({
  alias: z
    .string()
    .min(3, 'El alias debe tener al menos 3 caracteres')
    .max(30, 'El alias no puede superar 30 caracteres')
    .trim()
    .toLowerCase(),
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede superar 100 caracteres')
    .trim(),
  edad: z
    .number()
    .int()
    .min(8, 'La edad mínima es 8 años')
    .max(99, 'La edad máxima es 99 años'),
  nivel: z.enum(['principiante', 'intermedio', 'avanzado']).default('principiante'),
  activo: z.boolean().default(true),
});

export const updatePlayerSchema = createPlayerSchema.partial();

export type CreatePlayerDto = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerDto = z.infer<typeof updatePlayerSchema>;
