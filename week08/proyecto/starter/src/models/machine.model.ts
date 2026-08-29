import { Schema, model, Document } from 'mongoose';

export interface IMachine extends Document {
  nombre: string;
  fabricante: string;
  anio: number;
  tipoJuego: 'lucha' | 'carreras' | 'puzzle' | 'shooter' | 'plataformas' | 'retro' | 'otro';
  estado: 'operativa' | 'en_reparacion' | 'retirada';
  ubicacion: string;
  tarifaPorHora: number;
  disponible: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const machineSchema = new Schema<IMachine>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    fabricante: {
      type: String,
      required: true,
      trim: true,
    },
    anio: {
      type: Number,
      required: true,
      min: 1970,
      max: 2030,
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
      required: true,
      trim: true,
    },
    tarifaPorHora: {
      type: Number,
      required: true,
      min: 0,
    },
    disponible: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Machine = model<IMachine>('Machine', machineSchema);
