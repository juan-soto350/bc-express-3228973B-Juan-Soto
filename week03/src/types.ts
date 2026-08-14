// Tipos del dominio: Sala de Videojuegos / Arcade
// Entidades: machines, tokens, players, maintenance

// ============== Contratos comunes (reutilizables) ==============

/**
 * Resultado paginado genérico.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Respuesta con un solo recurso envuelto en { data }.
 */
export interface DataResponse<T> {
  data: T;
}

/**
 * Contrato de error uniforme para toda la API.
 */
export interface ErrorResponse {
  error: string;
  message: string;
}

// ============== Machine ==============

export type MachineEstado = 'activa' | 'inactiva' | 'mantenimiento';

export interface Machine {
  id: number;
  nombre: string;
  tipo: string;
  precioPorFicha: number;
  estado: MachineEstado;
  ultimoMantenimiento: string;
  createdAt: string;
}

export interface CreateMachineDto {
  nombre: string;
  tipo: string;
  precioPorFicha: number;
  estado?: MachineEstado;
  ultimoMantenimiento?: string;
}

export interface UpdateMachineDto {
  nombre?: string;
  tipo?: string;
  precioPorFicha?: number;
  estado?: MachineEstado;
  ultimoMantenimiento?: string;
}

// ============== Token ==============

export type TokenEstado = 'activo' | 'usado' | 'expirado';

export interface Token {
  id: number;
  codigo: string;
  cantidad: number;
  machineId: number;
  playerId: number;
  estado: TokenEstado;
  createdAt: string;
}

export interface CreateTokenDto {
  codigo: string;
  cantidad: number;
  machineId: number;
  playerId: number;
  estado?: TokenEstado;
}

export interface UpdateTokenDto {
  codigo?: string;
  cantidad?: number;
  machineId?: number;
  playerId?: number;
  estado?: TokenEstado;
}

// ============== Player ==============

export type PlayerNivel = 'principiante' | 'intermedio' | 'experto';

export interface Player {
  id: number;
  nombre: string;
  alias: string;
  edad: number;
  nivel: PlayerNivel;
  createdAt: string;
}

export interface CreatePlayerDto {
  nombre: string;
  alias: string;
  edad: number;
  nivel?: PlayerNivel;
}

export interface UpdatePlayerDto {
  nombre?: string;
  alias?: string;
  edad?: number;
  nivel?: PlayerNivel;
}

// ============== Maintenance ==============

export interface Maintenance {
  id: number;
  machineId: number;
  tecnico: string;
  descripcion: string;
  fecha: string;
  costo: number;
  createdAt: string;
}

export interface CreateMaintenanceDto {
  machineId: number;
  tecnico: string;
  descripcion: string;
  fecha: string;
  costo: number;
}

export interface UpdateMaintenanceDto {
  machineId?: number;
  tecnico?: string;
  descripcion?: string;
  fecha?: string;
  costo?: number;
}
