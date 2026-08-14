// ============================================
// SERVICE — lógica de negocio (sin imports de Express)
// ============================================
import { AppError } from '../errors/AppError';
import * as repo from '../repositories/tokens.repository';
import { PaginatedResponse, Token } from '../types';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Token>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Token> {
  const token = await repo.findById(id);
  if (!token) throw new AppError(404, `Token ${id} not found`);
  return token;
}

export async function create(dto: repo.CreateTokenRepoDto): Promise<Token> {
  const existing = await repo.findByCodigo(dto.codigo);
  if (existing) throw new AppError(409, `Ya existe un token con el código ${dto.codigo}`);
  return repo.create(dto);
}

export async function update(id: number, dto: repo.UpdateTokenRepoDto): Promise<Token> {
  const updated = await repo.update(id, dto);
  if (!updated) throw new AppError(404, `Token ${id} not found`);
  return updated;
}

export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Token ${id} not found`);
  await repo.remove(id);
}
