import { Schema, model } from 'mongoose';

interface IToken {
  codigo: string;
  cantidad: number;
  estado: 'activo' | 'consumido' | 'expirado';
  player: Schema.Types.ObjectId;
}

const tokenSchema = new Schema<IToken>(
  {
    codigo: {
      type: String,
      required: [true, 'El código es requerido'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [1, 'La cantidad mínima es 1'],
    },
    estado: {
      type: String,
      enum: ['activo', 'consumido', 'expirado'],
      default: 'activo',
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'El jugador es requerido'],
    },
  },
  {
    timestamps: true,
  },
);

export const Token = model<IToken>('Token', tokenSchema);
