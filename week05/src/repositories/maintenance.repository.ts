// src/repositories/maintenance.repository.ts — Acceso a datos con Prisma

import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from '../schemas/maintenance.schema';
import { PaginatedResponse } from '../types';

export const maintenanceInclude = {
  machine: {
    select: { id: true, codigo: true, nombre: true, tipo: true },
  },
} satisfies Prisma.MaintenanceInclude;

export async function findAll(
  page: number,
  limit: number
): Promise<PaginatedResponse<Prisma.MaintenanceGetPayload<{ include: typeof maintenanceInclude }>>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.maintenance.findMany({
      skip,
      take: limit,
      include: maintenanceInclude,
      orderBy: { fecha: 'desc' },
    }),
    prisma.maintenance.count(),
  ]);
  return { data, total, page, limit };
}

export async function findById(id: number): Promise<Prisma.MaintenanceGetPayload<{ include: typeof maintenanceInclude }> | null> {
  const record = await prisma.maintenance.findUnique({
    where: { id },
    include: maintenanceInclude,
  });
  return record;
}

export async function create(
  data: CreateMaintenanceDto
): Promise<Prisma.MaintenanceGetPayload<{ include: typeof maintenanceInclude }>> {
  try {
    return await prisma.maintenance.create({
      data: {
        machineId: data.machineId,
        tecnico: data.tecnico,
        descripcion: data.descripcion,
        fecha: data.fecha,
        costo: data.costo,
      },
      include: maintenanceInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new AppError(400, `La máquina con id ${data.machineId} no existe`);
    }
    throw err;
  }
}

export async function update(
  id: number,
  data: UpdateMaintenanceDto
): Promise<Prisma.MaintenanceGetPayload<{ include: typeof maintenanceInclude }>> {
  try {
    return await prisma.maintenance.update({
      where: { id },
      data: {
        ...(data.machineId !== undefined && { machineId: data.machineId }),
        ...(data.tecnico !== undefined && { tecnico: data.tecnico }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.fecha !== undefined && { fecha: data.fecha }),
        ...(data.costo !== undefined && { costo: data.costo }),
      },
      include: maintenanceInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Maintenance ${id} not found`);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new AppError(400, `La máquina con id ${data.machineId} no existe`);
    }
    throw err;
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await prisma.maintenance.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Maintenance ${id} not found`);
    }
    throw err;
  }
}
