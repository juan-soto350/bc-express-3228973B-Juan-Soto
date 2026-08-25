// ============================================
// PASO 1: Schema y Model de Player
// ============================================

// Mongoose permite definir la estructura del documento usando Schema.
// La interfaz TypeScript define los tipos de los campos.
// El Model es la clase que usamos para hacer queries a la colección.

import { Schema, model } from 'mongoose';

// Descomenta las siguientes líneas (PASO 1 — interfaz y schema):
// interface IPlayer {
//   alias: string;
//   nombre: string;
//   edad: number;
//   nivel: 'principiante' | 'intermedio' | 'avanzado';
//   activo: boolean;
// }

// const playerSchema = new Schema<IPlayer>(
//   {
//     alias: {
//       type: String,
//       required: [true, 'El alias es requerido'],
//       unique: true,           // índice UNIQUE — violación lanza error 11000
//       trim: true,
//       lowercase: true,
//       minlength: [3, 'El alias debe tener al menos 3 caracteres'],
//       maxlength: [30, 'El alias no puede superar 30 caracteres'],
//     },
//     nombre: {
//       type: String,
//       required: [true, 'El nombre es requerido'],
//       trim: true,
//       maxlength: [100, 'El nombre no puede superar 100 caracteres'],
//     },
//     edad: {
//       type: Number,
//       required: [true, 'La edad es requerida'],
//       min: [8, 'La edad mínima es 8 años'],
//       max: [99, 'La edad máxima es 99 años'],
//     },
//     nivel: {
//       type: String,
//       enum: ['principiante', 'intermedio', 'avanzado'],
//       default: 'principiante',
//     },
//     activo: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,         // añade createdAt y updatedAt automáticamente
//   },
// );

// // 'Player' (singular) → colección 'players' (plural, lowercase)
// export const Player = model<IPlayer>('Player', playerSchema);
