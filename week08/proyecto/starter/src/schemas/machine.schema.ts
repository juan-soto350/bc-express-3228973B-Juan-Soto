import { z } from 'zod';

export const createMachineSchema = z.object({
  body: z.object({
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100)
      .regex(/^[^<>]*$/, 'El nombre no debe contener caracteres HTML'),
    fabricante: z
      .string()
      .min(1, 'El fabricante es requerido')
      .regex(/^[^<>]*$/, 'El fabricante no debe contener caracteres HTML'),
    anio: z.number().int().min(1970).max(2030),
    tipoJuego: z.enum(['lucha', 'carreras', 'puzzle', 'shooter', 'plataformas', 'retro', 'otro']).default('otro'),
    estado: z.enum(['operativa', 'en_reparacion', 'retirada']).default('operativa'),
    ubicacion: z
      .string()
      .min(1, 'La ubicación es requerida')
      .regex(/^[^<>]*$/, 'La ubicación no debe contener caracteres HTML'),
    tarifaPorHora: z.number().min(0, 'La tarifa no puede ser negativa'),
    disponible: z.boolean().default(true),
  }),
});

export const updateMachineSchema = z.object({
  body: z.object({
    nombre: z.string().min(2).max(100).regex(/^[^<>]*$/).optional(),
    fabricante: z.string().min(1).regex(/^[^<>]*$/).optional(),
    anio: z.number().int().min(1970).max(2030).optional(),
    tipoJuego: z.enum(['lucha', 'carreras', 'puzzle', 'shooter', 'plataformas', 'retro', 'otro']).optional(),
    estado: z.enum(['operativa', 'en_reparacion', 'retirada']).optional(),
    ubicacion: z.string().min(1).regex(/^[^<>]*$/).optional(),
    tarifaPorHora: z.number().min(0).optional(),
    disponible: z.boolean().optional(),
  }),
});

export type CreateMachineDto = z.infer<typeof createMachineSchema>['body'];
export type UpdateMachineDto = z.infer<typeof updateMachineSchema>['body'];
