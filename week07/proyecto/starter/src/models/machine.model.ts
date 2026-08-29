import mongoose, { Document, Schema } from 'mongoose';

export interface IMachine extends Document {
  nombre: string;
  fabricante: string;
  anio: number;
  tipoJuego: 'lucha' | 'carreras' | 'puzzle' | 'shooter' | 'plataformas' | 'retro' | 'otro';
  estado: 'operativa' | 'en_reparacion' | 'retirada';
  ubicacion: string;
  tarifaPorHora: number;
  disponible: boolean;
  agregadoPor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const machineSchema = new Schema<IMachine>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    fabricante: {
      type: String,
      required: [true, 'El fabricante es requerido'],
      trim: true,
    },
    anio: {
      type: Number,
      required: [true, 'El año es requerido'],
      min: [1970, 'El año mínimo es 1970'],
      max: [2030, 'El año máximo es 2030'],
    },
    tipoJuego: {
      type: String,
      enum: ['lucha', 'carreras', 'puzzle', 'shooter', 'plataformas', 'retro', 'otro'],
      default: 'otro',
    },
    estado: {
      type: String,
      enum: ['operativa', 'en_reparacion', 'retirada'],
      default: 'operativa',
    },
    ubicacion: {
      type: String,
      required: [true, 'La ubicación es requerida'],
      trim: true,
    },
    tarifaPorHora: {
      type: Number,
      required: [true, 'La tarifa por hora es requerida'],
      min: [0, 'La tarifa no puede ser negativa'],
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    agregadoPor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const MachineModel = mongoose.model<IMachine>('Machine', machineSchema);
