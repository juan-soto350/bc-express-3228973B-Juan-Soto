// ============================================
// SCHEMAS — Machine (máquina arcade)
// ============================================
import { z } from 'zod';

export const MACHINE_ESTADOS = ['activa', 'inactiva', 'mantenimiento'] as const;

export const createMachineSchema = z.object({
  nombre: z.string().min(1, 'nombre es obligatorio').trim(),
  tipo: z.string().min(1, 'tipo es obligatorio').trim(),
  precioPorFicha: z
    .number()
    .int('precioPorFicha debe ser un entero')
    .nonnegative('precioPorFicha no puede ser negativo'),
  estado: z.enum(MACHINE_ESTADOS).optional(),
  ultimoMantenimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'ultimoMantenimiento debe tener formato YYYY-MM-DD')
    .optional(),
});

export const updateMachineSchema = createMachineSchema.partial();

export type CreateMachineDto = z.infer<typeof createMachineSchema>;
export type UpdateMachineDto = z.infer<typeof updateMachineSchema>;
