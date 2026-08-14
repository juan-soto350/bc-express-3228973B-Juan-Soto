// src/services/maintenance.service.ts — Lógica de negocio (sin imports de Express)

import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import * as repo from '../repositories/maintenance.repository';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from '../schemas/maintenance.schema';
import { PaginatedResponse } from '../types';

type MaintenanceWithMachine = Prisma.MaintenanceGetPayload<{ include: typeof import('../repositories/maintenance.repository')['maintenanceInclude'] }>;

export async function listMaintenance(
  page: number,
  limit: number
): Promise<PaginatedResponse<MaintenanceWithMachine>> {
  return repo.findAll(page, limit);
}

export async function getMaintenance(id: number): Promise<MaintenanceWithMachine> {
  const record = await repo.findById(id);
  if (!record) throw new AppError(404, `Maintenance ${id} not found`);
  return record;
}

export async function createMaintenance(data: CreateMaintenanceDto): Promise<MaintenanceWithMachine> {
  return repo.create(data);
}

export async function updateMaintenance(
  id: number,
  data: UpdateMaintenanceDto
): Promise<MaintenanceWithMachine> {
  return repo.update(id, data);
}

export async function deleteMaintenance(id: number): Promise<void> {
  await repo.remove(id);
}
