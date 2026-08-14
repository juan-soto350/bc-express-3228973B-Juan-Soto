// src/repositories/tokens.repository.ts — Acceso a datos con Prisma

import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { CreateTokenDto, UpdateTokenDto } from '../schemas/token.schema';
import { PaginatedResponse } from '../types';

export const tokenInclude = {
  machine: {
    select: { id: true, codigo: true, nombre: true },
  },
  player: {
    select: { id: true, alias: true, nombre: true },
  },
} satisfies Prisma.TokenInclude;

export async function findAll(
  page: number,
  limit: number
): Promise<PaginatedResponse<Prisma.TokenGetPayload<{ include: typeof tokenInclude }>>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.token.findMany({
      skip,
      take: limit,
      include: tokenInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.token.count(),
  ]);
  return { data, total, page, limit };
}

export async function findById(id: number): Promise<Prisma.TokenGetPayload<{ include: typeof tokenInclude }> | null> {
  const token = await prisma.token.findUnique({
    where: { id },
    include: tokenInclude,
  });
  return token;
}

export async function create(
  data: CreateTokenDto
): Promise<Prisma.TokenGetPayload<{ include: typeof tokenInclude }>> {
  try {
    return await prisma.token.create({
      data: {
        codigo: data.codigo,
        cantidad: data.cantidad,
        estado: data.estado ?? 'activo',
        machineId: data.machineId,
        playerId: data.playerId,
      },
      include: tokenInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `Ya existe un token con el código ${data.codigo}`);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new AppError(400, 'La máquina o el jugador referenciado no existe');
    }
    throw err;
  }
}

export async function update(
  id: number,
  data: UpdateTokenDto
): Promise<Prisma.TokenGetPayload<{ include: typeof tokenInclude }>> {
  try {
    return await prisma.token.update({
      where: { id },
      data: {
        ...(data.codigo !== undefined && { codigo: data.codigo }),
        ...(data.cantidad !== undefined && { cantidad: data.cantidad }),
        ...(data.estado !== undefined && { estado: data.estado }),
        ...(data.machineId !== undefined && { machineId: data.machineId }),
        ...(data.playerId !== undefined && { playerId: data.playerId }),
      },
      include: tokenInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Token ${id} not found`);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, `Ya existe un token con el código ${data.codigo}`);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new AppError(400, 'La máquina o el jugador referenciado no existe');
    }
    throw err;
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await prisma.token.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Token ${id} not found`);
    }
    throw err;
  }
}
