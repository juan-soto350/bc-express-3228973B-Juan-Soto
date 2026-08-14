// src/services/tokens.service.ts — Lógica de negocio (sin imports de Express)

import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import * as repo from '../repositories/tokens.repository';
import { CreateTokenDto, UpdateTokenDto } from '../schemas/token.schema';
import { PaginatedResponse } from '../types';

type TokenWithRelations = Prisma.TokenGetPayload<{ include: typeof import('../repositories/tokens.repository')['tokenInclude'] }>;

export async function listTokens(
  page: number,
  limit: number
): Promise<PaginatedResponse<TokenWithRelations>> {
  return repo.findAll(page, limit);
}

export async function getToken(id: number): Promise<TokenWithRelations> {
  const token = await repo.findById(id);
  if (!token) throw new AppError(404, `Token ${id} not found`);
  return token;
}

export async function createToken(data: CreateTokenDto): Promise<TokenWithRelations> {
  return repo.create(data);
}

export async function updateToken(id: number, data: UpdateTokenDto): Promise<TokenWithRelations> {
  return repo.update(id, data);
}

export async function deleteToken(id: number): Promise<void> {
  await repo.remove(id);
}
