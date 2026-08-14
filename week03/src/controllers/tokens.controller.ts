// Capa de Controller: extraer -> llamar service -> responder.

import { NextFunction, Request, Response } from 'express';
import { DomainError, tokensService } from '../services/tokens.service';
import { DataResponse, ErrorResponse, PaginatedResponse, Token } from '../types';

function handleError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof DomainError) {
    const body: ErrorResponse = {
      error: err.status === 404 ? 'Not Found' : 'Bad Request',
      message: err.message,
    };
    res.status(err.status).json(body);
    return;
  }
  next(err);
}

export const tokensController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result: PaginatedResponse<Token> = await tokensService.list(req.query.page, req.query.limit);
      res.status(200).json(result);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number.parseInt(req.params.id, 10);
      const t = await tokensService.getById(id);
      res.status(200).json({ data: t } as DataResponse<Token>);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const t = await tokensService.create(req.body);
      res.status(201).json({ data: t } as DataResponse<Token>);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number.parseInt(req.params.id, 10);
      const t = await tokensService.update(id, req.body);
      res.status(200).json({ data: t } as DataResponse<Token>);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number.parseInt(req.params.id, 10);
      await tokensService.remove(id);
      res.status(204).send();
    } catch (err) {
      handleError(err, res, next);
    }
  },
};
