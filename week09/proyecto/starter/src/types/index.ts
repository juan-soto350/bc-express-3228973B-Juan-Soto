export type UserRole = 'user' | 'admin';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

// ============================================================
// Dominio: Sala de videojuegos / Arcade
// Recurso principal: máquinas arcade
// ============================================================

export interface CreateMachineDto {
  nombre: string;
  fabricante: string;
  anio: number;
  tipoJuego: 'lucha' | 'carreras' | 'puzzle' | 'shooter' | 'plataformas' | 'retro' | 'otro';
  estado: 'operativa' | 'en_reparacion' | 'retirada';
  ubicacion: string;
  tarifaPorHora: number;
  disponible: boolean;
}

export interface UpdateMachineDto {
  nombre?: string;
  fabricante?: string;
  anio?: number;
  tipoJuego?: 'lucha' | 'carreras' | 'puzzle' | 'shooter' | 'plataformas' | 'retro' | 'otro';
  estado?: 'operativa' | 'en_reparacion' | 'retirada';
  ubicacion?: string;
  tarifaPorHora?: number;
  disponible?: boolean;
}
