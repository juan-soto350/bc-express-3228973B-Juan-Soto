// src/services/players.service.ts — Lógica de negocio (sin imports de Express)

import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import * as repo from '../repositories/players.repository';
import { CreatePlayerDto, UpdatePlayerDto } from '../schemas/player.schema';
import { PaginatedResponse } from '../types';

type PlayerWithTokens = Prisma.PlayerGetPayload<{ include: typeof import('../repositories/players.repository')['playerInclude'] }>;

export async function listPlayers(
  page: number,
  limit: number
): Promise<PaginatedResponse<PlayerWithTokens>> {
  return repo.findAll(page, limit);
}

export async function getPlayer(id: number): Promise<PlayerWithTokens> {
  const player = await repo.findById(id);
  if (!player) throw new AppError(404, `Player ${id} not found`);
  return player;
}

export async function createPlayer(data: CreatePlayerDto): Promise<PlayerWithTokens> {
  return repo.create(data);
}

export async function updatePlayer(id: number, data: UpdatePlayerDto): Promise<PlayerWithTokens> {
  return repo.update(id, data);
}

export async function deletePlayer(id: number): Promise<void> {
  await repo.remove(id);
}
