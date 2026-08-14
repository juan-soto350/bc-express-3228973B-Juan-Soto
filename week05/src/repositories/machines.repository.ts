// src/repositories/machines.repository.ts — Acceso a datos con Prisma

import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema';
import { PaginatedResponse } from '../types';

export interface MachineWithMaintenance {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  precioPorFicha: number;
  estado: 'activa' | 'inactiva' | 'mantenimiento';
  ultimoMantenimiento: string | null;
  createdAt: Date;
  updatedAt: Date;
  maintenance: Array<{
    id: number;
    machineId: number;
    tecnico: string;
    descripcion: string;
    fecha: string;
    costo: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const machineInclude = {
  maintenance: {
    orderBy: { fecha: 'desc' as const },
  },
} satisfies Prisma.MachineInclude;

export async function findAll(
  page: number,
  limit: number
): Promise<PaginatedResponse<MachineWithMaintenance>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.machine.findMany({
      skip,
      take: limit,
      include: machineInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.machine.count(),
  ]);
  return { data, total, page, limit };
}

export async function findById(id: number): Promise<MachineWithMaintenance | null> {
  const machine = await prisma.machine.findUnique({
    where: { id },
    include: machineInclude,
  });
  return machine;
}

export async function create(data: CreateMachineDto): Promise<MachineWithMaintenance> {
  try {
    return await prisma.machine.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        tipo: data.tipo,
        precioPorFicha: data.precioPorFicha,
        estado: data.estado ?? 'activa',
        ultimoMantenimiento: data.ultimoMantenimiento ?? null,
      },
      include: machineInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, 'Ya existe una máquina con ese código');
    }
    throw err;
  }
}

export async function update(id: number, data: UpdateMachineDto): Promise<MachineWithMaintenance> {
  try {
    return await prisma.machine.update({
      where: { id },
      data: {
        ...(data.codigo !== undefined && { codigo: data.codigo }),
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.tipo !== undefined && { tipo: data.tipo }),
        ...(data.precioPorFicha !== undefined && { precioPorFicha: data.precioPorFicha }),
        ...(data.estado !== undefined && { estado: data.estado }),
        ...(data.ultimoMantenimiento !== undefined && {
          ultimoMantenimiento: data.ultimoMantenimiento,
        }),
      },
      include: machineInclude,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Machine ${id} not found`);
    }
    throw err;
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await prisma.machine.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Machine ${id} not found`);
    }
    throw err;
  }
}
