// src/repositories/players.repository.ts — Acceso a datos con Prisma

import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { CreatePlayerDto, UpdatePlayerDto } from '../schemas/player.schema';
import { PaginatedResponse } from '../types';

export const playerInclude = {
  tokens: {
    select: { id: true, codigo: true, cantidad: true, estado: true },
  },
} satisfies Prisma.PlayerInclude;

export async function findAll(
  page: number,
  limit: number
): Promise<PaginatedResponse<Prisma.PlayerGetPayload<{ include: typeof playerInclude }>>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.player.findMany({
      skip,
      take: limit,
      include: playerInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.player.count(),
  ]);
  return { data, total, page, limit };
}

export async function findById(id: number): Promise<Prisma.PlayerGetPayload<{ include: typeof playerInclude }> | null> {
  const player = await prisma.player.findUnique({
    where: { id },
    include: playerInclude,
  });
  return player;
}

export async function create(
  data: CreatePlayerDto
): Promise<Prisma.PlayerGetPayload<{ include: typeof playerInclude }>> {
  try {
    return await prisma.player.create({
      data: {
        alias: data.alias,
        nombre: data.nombre,
        edad: data.edad,
        nivel: data.nivel ?? 'principiante',
      },
      include: playerInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `Ya existe un jugador con el alias ${data.alias}`);
    }
    throw err;
  }
}

export async function update(
  id: number,
  data: UpdatePlayerDto
): Promise<Prisma.PlayerGetPayload<{ include: typeof playerInclude }>> {
  try {
    return await prisma.player.update({
      where: { id },
      data: {
        ...(data.alias !== undefined && { alias: data.alias }),
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.edad !== undefined && { edad: data.edad }),
        ...(data.nivel !== undefined && { nivel: data.nivel }),
      },
      include: playerInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Player ${id} not found`);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `Ya existe un jugador con el alias ${data.alias}`);
    }
    throw err;
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await prisma.player.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Player ${id} not found`);
    }
    throw err;
  }
}
