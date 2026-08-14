// src/services/machines.service.ts — Lógica de negocio (sin imports de Express)

import { AppError } from '../errors/AppError';
import * as repo from '../repositories/machines.repository';
import { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema';
import { PaginatedResponse } from '../types';

export async function listMachines(
  page: number,
  limit: number
): Promise<PaginatedResponse<repo.MachineWithMaintenance>> {
  return repo.findAll(page, limit);
}

export async function getMachine(id: number): Promise<repo.MachineWithMaintenance> {
  const machine = await repo.findById(id);
  if (!machine) throw new AppError(404, `Machine ${id} not found`);
  return machine;
}

export async function createMachine(data: CreateMachineDto): Promise<repo.MachineWithMaintenance> {
  return repo.create(data);
}

export async function updateMachine(
  id: number,
  data: UpdateMachineDto
): Promise<repo.MachineWithMaintenance> {
  return repo.update(id, data);
}

export async function deleteMachine(id: number): Promise<void> {
  await repo.remove(id);
}
