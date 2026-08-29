// ============================================
// PASO 1: Schema y Model de Player
// ============================================

import { Schema, model, type InferSchemaType } from 'mongoose';

interface IPlayer {
  alias: string;
  nombre: string;
  edad: number;
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  activo: boolean;
}

const playerSchema = new Schema<IPlayer>(
  {
    alias: {
      type: String,
      required: [true, 'El alias es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'El alias debe tener al menos 3 caracteres'],
      maxlength: [30, 'El alias no puede superar 30 caracteres'],
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    edad: {
      type: Number,
      required: [true, 'La edad es requerida'],
      min: [8, 'La edad mínima es 8 años'],
      max: [99, 'La edad máxima es 99 años'],
    },
    nivel: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado'],
      default: 'principiante',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Player = model<IPlayer>('Player', playerSchema);
export type { IPlayer };
