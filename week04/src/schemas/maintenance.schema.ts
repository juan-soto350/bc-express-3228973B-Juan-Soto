// ============================================
// SCHEMAS — Maintenance (mantenimiento)
// ============================================
import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  machineId: z.number().int('machineId debe ser un entero').positive('machineId debe ser mayor a 0'),
  tecnico: z.string().min(1, 'tecnico es obligatorio').trim(),
  descripcion: z.string().min(1, 'descripcion es obligatorio').trim(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'fecha debe tener formato YYYY-MM-DD'),
  costo: z.number().int('costo debe ser un entero').nonnegative('costo no puede ser negativo'),
});

export const updateMaintenanceSchema = createMaintenanceSchema.partial();

export type CreateMaintenanceDto = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceDto = z.infer<typeof updateMaintenanceSchema>;
