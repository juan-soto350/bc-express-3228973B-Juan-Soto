import { Request, Response, NextFunction } from 'express';
import * as machinesService from '../services/machines.service.js';
import { createMachineSchema, updateMachineSchema } from '../schemas/machine.schema.js';
import { AppError } from '../errors/AppError.js';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const machines = await machinesService.findAll();
    res.json({ data: machines, total: machines.length });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const machine = await machinesService.findById(req.params.id);
    if (!machine) throw new AppError(404, 'Máquina no encontrada');
    res.json({ data: machine });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = createMachineSchema.parse({ body: req.body });
    const machine = await machinesService.create(body, req.user.sub);
    res.status(201).json({ message: 'Máquina creada', data: machine });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = updateMachineSchema.parse({ body: req.body });
    const machine = await machinesService.update(
      req.params.id,
      body,
      req.user.sub,
      req.user.role as string
    );

    if (!machine) throw new AppError(404, 'Máquina no encontrada');
    res.json({ message: 'Máquina actualizada', data: machine });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
  try {
    const machine = await machinesService.remove(req.params.id);
    if (!machine) throw new AppError(404, 'Máquina no encontrada');
    res.json({ message: 'Máquina eliminada' });
  } catch (err) {
    next(err);
  }
}
