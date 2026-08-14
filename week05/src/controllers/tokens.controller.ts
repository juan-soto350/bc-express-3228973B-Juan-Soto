// src/controllers/tokens.controller.ts — Capa HTTP

import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import * as service from '../services/tokens.service';
import { createTokenSchema, updateTokenSchema } from '../schemas/token.schema';
import { PaginatedResponse, SingleResponse, ValidationErrorResponse } from '../types';

const idSchema = z.coerce.number().int().positive({
  message: 'El id debe ser un número entero positivo',
});

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
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 10));
    const result = await service.listTokens(page, limit);
    res.json(result satisfies PaginatedResponse<unknown>);
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
    const token = await service.getToken(parsed.data);
    res.json({ data: token } satisfies SingleResponse<unknown>);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createTokenSchema.safeParse(req.body);
    if (!result.success) {
      validationError(res, result.error);
      return;
    }
    const token = await service.createToken(result.data);
    res.status(201).json({ data: token } satisfies SingleResponse<unknown>);
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
    const result = updateTokenSchema.safeParse(req.body);
    if (!result.success) {
      validationError(res, result.error);
      return;
    }
    const token = await service.updateToken(parsedId.data, result.data);
    res.json({ data: token } satisfies SingleResponse<unknown>);
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
    await service.deleteToken(parsed.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
