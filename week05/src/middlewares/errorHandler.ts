// src/middlewares/errorHandler.ts — Manejador global de errores (4 parámetros)

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { isAppError } from '../errors/AppError';
import { ErrorResponse, ValidationErrorResponse } from '../types';

function formatIssues(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'id',
    message: issue.message,
  }));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. ZodError → 400 con issues[]
  if (err instanceof ZodError) {
    const body: ValidationErrorResponse = {
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues: formatIssues(err),
    };
    res.status(400).json(body);
    return;
  }

  // 2. AppError → statusCode
  if (isAppError(err)) {
    logger.warn(`[${err.statusCode}] ${err.message}`);
    const body: ErrorResponse = {
      error: 'Application Error',
      message: err.message,
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // 3. Error genérico → 500 (stack solo en desarrollo)
  const isProduction = process.env['NODE_ENV'] === 'production';
  const message = err instanceof Error ? err.message : 'Error desconocido';
  logger.error(`Unhandled error: ${message}`);
  const body: ErrorResponse = {
    error: 'Internal Server Error',
    message: isProduction ? 'Error interno del servidor' : message,
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  };
  res.status(500).json(body);
}
