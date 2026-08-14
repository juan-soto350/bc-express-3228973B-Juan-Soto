// ============================================
// SERVICE — lógica de negocio (sin imports de Express)
// ============================================
import { AppError } from '../errors/AppError';
import * as repo from '../repositories/maintenance.repository';
import { Maintenance, PaginatedResponse } from '../types';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Maintenance>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Maintenance> {
  const record = await repo.findById(id);
  if (!record) throw new AppError(404, `Maintenance ${id} not found`);
  return record;
}

export async function create(dto: repo.CreateMaintenanceRepoDto): Promise<Maintenance> {
  return repo.create(dto);
}

export async function update(id: number, dto: repo.UpdateMaintenanceRepoDto): Promise<Maintenance> {
  const updated = await repo.update(id, dto);
  if (!updated) throw new AppError(404, `Maintenance ${id} not found`);
  return updated;
}

export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Maintenance ${id} not found`);
  await repo.remove(id);
}
