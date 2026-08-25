// ============================================
// PASO 3: findAll con paginación
// PASO 4: findById, create, update, remove
// ============================================

import { MongoServerError } from 'mongodb';
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

// ============================================
// PASO 3 — findAll con paginación y filtro
// ============================================
// - Model.find(filter) devuelve un array (nunca null)
// - .lean() convierte a objetos JS planos (más eficiente para lectura)
// - countDocuments() cuenta documentos que coinciden con el filtro
//
// Descomenta la siguiente función (PASO 3):
// export async function findAll(
//   page: number,
//   limit: number,
//   search?: string,
// ): Promise<PaginatedResult<unknown>> {
//   const skip = (page - 1) * limit;
//
//   const filter = search
//     ? { alias: { $regex: search, $options: 'i' } }
//     : {};
//
//   const [data, total] = await Promise.all([
//     Player.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean(),
//     Player.countDocuments(filter),
//   ]);
//
//   return {
//     data,
//     total,
//     page,
//     totalPages: Math.ceil(total / limit),
//   };
// }

// ============================================
// PASO 4a — findById
// ============================================
// - findById(id) devuelve null si no existe → lanzar AppError(404)
// - Lanza CastError si el id no tiene formato de ObjectId → AppError(400)
//
// Descomenta la siguiente función (PASO 4a):
// export async function findById(id: string): Promise<unknown> {
//   try {
//     const player = await Player.findById(id).lean();
//     if (!player) throw new AppError(404, 'Player no encontrado');
//     return player;
//   } catch (err) {
//     if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
//     throw err;
//   }
// }

// ============================================
// PASO 4b — create
// ============================================
// - Model.create(dto) aplica los validadores del schema antes de insertar
// - Error 11000: índice unique violado → AppError(409)
//
// Descomenta la siguiente función (PASO 4b):
// export async function create(dto: CreatePlayerDto): Promise<unknown> {
//   try {
//     const player = await Player.create(dto);
//     return player.toJSON();
//   } catch (err) {
//     if (err instanceof MongoServerError && err.code === 11000) {
//       const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
//       throw new AppError(409, `El ${field} ya está registrado`);
//     }
//     throw err;
//   }
// }

// ============================================
// PASO 4c — update
// ============================================
// - findByIdAndUpdate con { new: true } retorna el documento actualizado
// - runValidators: true aplica validaciones del schema en el update
// - Retorna null si no existe → AppError(404)
//
// Descomenta la siguiente función (PASO 4c):
// export async function update(id: string, dto: UpdatePlayerDto): Promise<unknown> {
//   try {
//     const player = await Player.findByIdAndUpdate(id, dto, {
//       new: true,
//       runValidators: true,
//     }).lean();
//     if (!player) throw new AppError(404, 'Player no encontrado');
//     return player;
//   } catch (err) {
//     if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
//     if (err instanceof MongoServerError && err.code === 11000) {
//       const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
//       throw new AppError(409, `El ${field} ya está registrado`);
//     }
//     throw err;
//   }
// }

// ============================================
// PASO 4d — remove
// ============================================
// - findByIdAndDelete retorna null si no existe → AppError(404)
//
// Descomenta la siguiente función (PASO 4d):
// export async function remove(id: string): Promise<void> {
//   try {
//     const player = await Player.findByIdAndDelete(id).lean();
//     if (!player) throw new AppError(404, 'Player no encontrado');
//   } catch (err) {
//     if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
//     throw err;
//   }
// }
