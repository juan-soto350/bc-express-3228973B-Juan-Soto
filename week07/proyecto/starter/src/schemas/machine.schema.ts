import { z } from 'zod';

export const createMachineSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  fabricante: z.string().min(1, 'El fabricante es requerido'),
  anio: z.number().int().min(1970, 'El año mínimo es 1970').max(2030, 'El año máximo es 2030'),
  tipoJuego: z.enum(['lucha', 'carreras', 'puzzle', 'shooter', 'plataformas', 'retro', 'otro']).default('otro'),
  estado: z.enum(['operativa', 'en_reparacion', 'retirada']).default('operativa'),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  tarifaPorHora: z.number().min(0, 'La tarifa no puede ser negativa'),
  disponible: z.boolean().default(true),
});

export const updateMachineSchema = createMachineSchema.partial();

export type CreateMachineDto = z.infer<typeof createMachineSchema>;
export type UpdateMachineDto = z.infer<typeof updateMachineSchema>;
