import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as machinesService from '../services/machines.service.js';
import { createMachineSchema, updateMachineSchema, machineIdSchema } from '../validators/machines.schema.js';

export async function getAllHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const machines = await machinesService.getAll();
    res.status(200).json({ data: machines, total: machines.length });
  } catch (err) {
    next(err);
  }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = machineIdSchema.parse({ params: req.params });
    const machine = await machinesService.getById(params.id);
    res.status(200).json({ data: machine });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createMachineSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string };
    const machine = await machinesService.create(body, user.sub);
    res.status(201).json({ data: machine });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = machineIdSchema.parse({ params: req.params });
    const { body } = updateMachineSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string; role: string };
    const machine = await machinesService.update(params.id, body, user.sub, user.role);
    res.status(200).json({ data: machine });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = machineIdSchema.parse({ params: req.params });
    const user = res.locals['user'] as { sub: string; role: string };
    await machinesService.remove(params.id, user.sub, user.role);
    res.status(204).send();
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}
