import { Request, Response, NextFunction } from 'express';
import * as machinesService from '../services/machines.service';
import { createMachineSchema, updateMachineSchema } from '../schemas/machine.schema';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const machines = await machinesService.getAll();
    res.status(200).json(machines);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const machine = await machinesService.getById(id);
    res.status(200).json(machine);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createMachineSchema.parse(req.body);
    const userId = req.user!.sub;
    const machine = await machinesService.create(dto, userId);
    res.status(201).json(machine);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateMachineSchema.parse(req.body);
    const id = req.params.id as string;
    const machine = await machinesService.update(id, dto);
    res.status(200).json(machine);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await machinesService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
