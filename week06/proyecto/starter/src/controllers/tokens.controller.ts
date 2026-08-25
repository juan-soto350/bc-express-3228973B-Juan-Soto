import type { Request, Response, NextFunction } from 'express';
import * as tokensService from '../services/tokens.service';
import { createTokenSchema, updateTokenSchema } from '../schemas/token.schema';

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;

    const result = await tokensService.findAll(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = await tokensService.findById(req.params['id']);
    res.json({ data: token });
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createTokenSchema.parse(req.body);
    const token = await tokensService.create(parsed);
    res.status(201).json({ data: token });
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = updateTokenSchema.parse(req.body);
    const token = await tokensService.update(req.params['id'], parsed);
    res.json({ data: token });
  } catch (err) {
    next(err);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await tokensService.remove(req.params['id']);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
