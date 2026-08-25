// ============================================
// PASO 1: Schema y Model de Token
// ============================================

// Token representa una ficha comprada por un jugador.
// Usa Schema.Types.ObjectId para referenciar al jugador.

import { Schema, model } from 'mongoose';

// Descomenta las siguientes líneas (PASO 1 — interfaz y schema):
// interface IToken {
//   codigo: string;
//   cantidad: number;
//   estado: 'activo' | 'consumido' | 'expirado';
//   player: Schema.Types.ObjectId;  // Referencia a Player
// }

// const tokenSchema = new Schema<IToken>(
//   {
//     codigo: {
//       type: String,
//       required: [true, 'El código es requerido'],
//       unique: true,
//       uppercase: true,
//       trim: true,
//     },
//     cantidad: {
//       type: Number,
//       required: [true, 'La cantidad es requerida'],
//       min: [1, 'La cantidad mínima es 1'],
//     },
//     estado: {
//       type: String,
//       enum: ['activo', 'consumido', 'expirado'],
//       default: 'activo',
//     },
//     player: {
//       type: Schema.Types.ObjectId,  // tipo: ObjectId de MongoDB
//       ref: 'Player',                // nombre del Model al que apunta
//       required: [true, 'El jugador es requerido'],
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// export const Token = model<IToken>('Token', tokenSchema);
