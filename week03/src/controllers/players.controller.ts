// Capa de Controller: extraer -> llamar service -> responder.

import { NextFunction, Request, Response } from 'express';
import { DomainError, playersService } from '../services/players.service';
import { DataResponse, ErrorResponse, PaginatedResponse, Player } from '../types';

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

export const playersController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result: PaginatedResponse<Player> = await playersService.list(req.query.page, req.query.limit);
      res.status(200).json(result);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number.parseInt(req.params.id, 10);
      const p = await playersService.getById(id);
      res.status(200).json({ data: p } as DataResponse<Player>);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const p = await playersService.create(req.body);
      res.status(201).json({ data: p } as DataResponse<Player>);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number.parseInt(req.params.id, 10);
      const p = await playersService.update(id, req.body);
      res.status(200).json({ data: p } as DataResponse<Player>);
    } catch (err) {
      handleError(err, res, next);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number.parseInt(req.params.id, 10);
      await playersService.remove(id);
      res.status(204).send();
    } catch (err) {
      handleError(err, res, next);
    }
  },
};
