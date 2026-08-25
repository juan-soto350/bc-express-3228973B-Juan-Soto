// ============================================
// PASO 4: Repositorio de Tokens con populate()
// ============================================

// Sin populate, el endpoint devuelve el ObjectId crudo:
// { "player": "664abc..." }
//
// Con populate, devuelve el documento completo:
// { "player": { "_id": "664abc...", "alias": "carlosr", ... } }

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Token } from '../models/token.model';
import { AppError } from '../errors/AppError';
import type { CreateTokenDto, UpdateTokenDto } from '../schemas/token.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Descomenta la siguiente función (PASO 4a — findAll con populate):
// export async function findAll(
//   page: number,
//   limit: number,
// ): Promise<PaginatedResult<unknown>> {
//   const skip = (page - 1) * limit;
//
//   const [data, total] = await Promise.all([
//     Token.find()
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate('player')  // ← PASO 4: populate para traer el documento completo
//       .lean(),
//     Token.countDocuments(),
//   ]);
//
//   return {
//     data,
//     total,
//     page,
//     totalPages: Math.ceil(total / limit),
//   };
// }

// Descomenta la siguiente función (PASO 4b — findById con populate):
// export async function findById(id: string): Promise<unknown> {
//   try {
//     const token = await Token.findById(id)
//       .populate('player')  // ← PASO 4: populate para traer el documento completo
//       .lean();
//     if (!token) throw new AppError(404, 'Token no encontrado');
//     return token;
//   } catch (err) {
//     if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
//     throw err;
//   }
// }

// Descomenta la siguiente función (PASO 4c — create):
// export async function create(dto: CreateTokenDto): Promise<unknown> {
//   try {
//     const token = await Token.create(dto);
//     return token.toJSON();
//   } catch (err) {
//     if (err instanceof MongoServerError && err.code === 11000) {
//       const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
//       throw new AppError(409, `El ${field} ya está registrado`);
//     }
//     throw err;
//   }
// }

// Descomenta la siguiente función (PASO 4d — update):
// export async function update(id: string, dto: UpdateTokenDto): Promise<unknown> {
//   try {
//     const token = await Token.findByIdAndUpdate(id, dto, {
//       new: true,
//       runValidators: true,
//     }).lean();
//     if (!token) throw new AppError(404, 'Token no encontrado');
//     return token;
//   } catch (err) {
//     if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
//     if (err instanceof MongoServerError && err.code === 11000) {
//       const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
//       throw new AppError(409, `El ${field} ya está registrado`);
//     }
//     throw err;
//   }
// }

// Descomenta la siguiente función (PASO 4e — remove):
// export async function remove(id: string): Promise<void> {
//   try {
//     const token = await Token.findByIdAndDelete(id).lean();
//     if (!token) throw new AppError(404, 'Token no encontrado');
//   } catch (err) {
//     if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
//     throw err;
//   }
// }
