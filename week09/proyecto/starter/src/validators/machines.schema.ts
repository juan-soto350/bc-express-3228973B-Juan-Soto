import { z } from 'zod';

// ============================================================
// SCHEMAS ZOD — dominio: Sala de videojuegos / Arcade
// ============================================================

export const createMachineSchema = z.object({
  body: z.object({
    nombre:        z.string().min(2).max(100),
    fabricante:    z.string().min(1),
    anio:          z.number().int().min(1970).max(2030),
    tipoJuego:     z.enum(['lucha', 'carreras', 'puzzle', 'shooter', 'plataformas', 'retro', 'otro']).default('otro'),
    estado:        z.enum(['operativa', 'en_reparacion', 'retirada']).default('operativa'),
    ubicacion:     z.string().min(1),
    tarifaPorHora: z.number().min(0),
    disponible:    z.boolean().default(true),
  }),
});

export const updateMachineSchema = z.object({
  body: z.object({
    nombre:        z.string().min(2).max(100).optional(),
    fabricante:    z.string().min(1).optional(),
    anio:          z.number().int().min(1970).max(2030).optional(),
    tipoJuego:     z.enum(['lucha', 'carreras', 'puzzle', 'shooter', 'plataformas', 'retro', 'otro']).optional(),
    estado:        z.enum(['operativa', 'en_reparacion', 'retirada']).optional(),
    ubicacion:     z.string().min(1).optional(),
    tarifaPorHora: z.number().min(0).optional(),
    disponible:    z.boolean().optional(),
  }),
});

export const machineIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid MongoDB ID'),
  }),
});
