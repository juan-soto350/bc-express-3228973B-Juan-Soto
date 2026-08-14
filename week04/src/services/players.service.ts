// ============================================
// SERVICE — lógica de negocio (sin imports de Express)
// ============================================
import { AppError } from '../errors/AppError';
import * as repo from '../repositories/players.repository';
import { PaginatedResponse, Player } from '../types';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Player>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Player> {
  const player = await repo.findById(id);
  if (!player) throw new AppError(404, `Player ${id} not found`);
  return player;
}

export async function create(dto: repo.CreatePlayerRepoDto): Promise<Player> {
  const existing = await repo.findByAlias(dto.alias);
  if (existing) throw new AppError(409, `Ya existe un jugador con el alias ${dto.alias}`);
  return repo.create(dto);
}

export async function update(id: number, dto: repo.UpdatePlayerRepoDto): Promise<Player> {
  const updated = await repo.update(id, dto);
  if (!updated) throw new AppError(404, `Player ${id} not found`);
  return updated;
}

export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Player ${id} not found`);
  await repo.remove(id);
}
