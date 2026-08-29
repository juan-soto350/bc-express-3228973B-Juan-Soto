// ============================================
// PASO 3: findAll con paginación
// PASO 4: findById, create, update, remove
// ============================================

import mongoose from 'mongoose';
import { Player } from '../models/player.model';
import { AppError } from '../errors/AppError';
import type { CreatePlayerDto, UpdatePlayerDto } from '../schemas/player.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// PASO 3 — findAll con paginación y filtro
export async function findAll(
  page: number,
  limit: number,
  search?: string,
): Promise<PaginatedResult<unknown>> {
  const skip = (page - 1) * limit;

  const filter = search
    ? { alias: { $regex: search, $options: 'i' } }
    : {};

  const [data, total] = await Promise.all([
    Player.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Player.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// PASO 4a — findById
export async function findById(id: string): Promise<unknown> {
  try {
    const player = await Player.findById(id).lean();
    if (!player) throw new AppError(404, 'Player no encontrado');
    return player;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

// PASO 4b — create
export async function create(dto: CreatePlayerDto): Promise<unknown> {
  try {
    const player = await Player.create(dto);
    return player.toJSON();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'MongoServerError' && (err as unknown as Record<string, unknown>).code === 11000) {
      const keyVal = (err as unknown as Record<string, Record<string, unknown>>).keyValue ?? {};
      const field = Object.keys(keyVal)[0] ?? 'campo';
      throw new AppError(409, `El ${field} ya está registrado`);
    }
    throw err;
  }
}

// PASO 4c — update
export async function update(id: string, dto: UpdatePlayerDto): Promise<unknown> {
  try {
    const player = await Player.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).lean();
    if (!player) throw new AppError(404, 'Player no encontrado');
    return player;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

// PASO 4d — remove
export async function remove(id: string): Promise<void> {
  try {
    const player = await Player.findByIdAndDelete(id).lean();
    if (!player) throw new AppError(404, 'Player no encontrado');
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}
