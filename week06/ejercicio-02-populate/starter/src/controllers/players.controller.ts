import type { Request, Response, NextFunction } from 'express';
import * as playersService from '../services/players.service';
import { createPlayerSchema, updatePlayerSchema } from '../schemas/player.schema';

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const search = req.query['search'] as string | undefined;

    const result = await playersService.findAll(page, limit, search);
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
    const player = await playersService.findById(String(req.params['id']));
    res.json({ data: player });
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
    const parsed = createPlayerSchema.parse(req.body);
    const player = await playersService.create(parsed);
    res.status(201).json({ data: player });
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
    const parsed = updatePlayerSchema.parse(req.body);
    const player = await playersService.update(String(req.params['id']), parsed);
    res.json({ data: player });
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
    await playersService.remove(String(req.params['id']));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
