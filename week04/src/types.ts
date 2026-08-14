// ============================================
// TYPES — entidades del dominio: Sala de Videojuegos / Arcade
// ============================================

// ---------- Contratos de respuesta (genéricos) ----------

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  issues: Array<{ field: string; message: string }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}

// ---------- Machine (máquina arcade) ----------

export type MachineEstado = 'activa' | 'inactiva' | 'mantenimiento';

export interface Machine {
  id: number;
  nombre: string;
  tipo: string;
  precioPorFicha: number;
  estado: MachineEstado;
  ultimoMantenimiento: string;
  createdAt: Date;
}

// ---------- Token (ficha) ----------

export type TokenEstado = 'activo' | 'usado' | 'expirado';

export interface Token {
  id: number;
  codigo: string;
  cantidad: number;
  machineId: number;
  playerId: number;
  estado: TokenEstado;
  createdAt: Date;
}

// ---------- Player (jugador) ----------

export type PlayerNivel = 'principiante' | 'intermedio' | 'experto';

export interface Player {
  id: number;
  nombre: string;
  alias: string;
  edad: number;
  nivel: PlayerNivel;
  createdAt: Date;
}

// ---------- Maintenance (mantenimiento) ----------

export interface Maintenance {
  id: number;
  machineId: number;
  tecnico: string;
  descripcion: string;
  fecha: string;
  costo: number;
  createdAt: Date;
}
