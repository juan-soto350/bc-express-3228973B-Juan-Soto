// ============================================
// CONTROLLER — delgado: extraer → service → responder
// ============================================
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import * as service from '../services/players.service';
import { createPlayerSchema, updatePlayerSchema } from '../schemas/player.schema';
import { PaginatedResponse, Player, SingleResponse, ValidationErrorResponse } from '../types';

// Schema para validar el parámetro :id
const idSchema = z.coerce.number().int().positive({
  message: 'El id debe ser un número entero positivo',
});

// Helper para extraer issues de un ZodError
function formatIssues(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'id',
    message: issue.message,
  }));
}

function validationError(res: Response, error: z.ZodError): void {
  const body: ValidationErrorResponse = {
    error: 'Validation Error',
    message: 'Datos de entrada inválidos',
    issues: formatIssues(error),
  };
  res.status(400).json(body);
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const result = await service.findAll({ page, limit });
    res.json(result satisfies PaginatedResponse<Player>);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      validationError(res, parsed.error);
      return;
    }
    const player = await service.findById(parsed.data);
    res.json({ data: player } satisfies SingleResponse<Player>);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createPlayerSchema.safeParse(req.body);
    if (!result.success) {
      validationError(res, result.error);
      return;
    }
    const player = await service.create(result.data);
    res.status(201).json({ data: player } satisfies SingleResponse<Player>);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      validationError(res, parsedId.error);
      return;
    }
    const result = updatePlayerSchema.safeParse(req.body);
    if (!result.success) {
      validationError(res, result.error);
      return;
    }
    const player = await service.update(parsedId.data, result.data);
    res.json({ data: player } satisfies SingleResponse<Player>);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      validationError(res, parsed.error);
      return;
    }
    await service.remove(parsed.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
