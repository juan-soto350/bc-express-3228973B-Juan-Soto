// Capa de Service: paginación y validaciones de dominio.

import { playersRepository } from '../repositories/players.repository';
import { CreatePlayerDto, PaginatedResponse, Player, PlayerNivel, UpdatePlayerDto } from '../types';

export class DomainError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const NIVELES_VALIDOS: PlayerNivel[] = ['principiante', 'intermedio', 'experto'];

function parsePagination(rawPage: unknown, rawLimit: unknown) {
  const page = Number.parseInt(String(rawPage ?? DEFAULT_PAGE), 10);
  const limit = Number.parseInt(String(rawLimit ?? DEFAULT_LIMIT), 10);
  if (!Number.isFinite(page) || page < 1) {
    throw new DomainError(400, 'page debe ser un entero >= 1');
  }
  if (!Number.isFinite(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new DomainError(400, `limit debe ser un entero entre 1 y ${MAX_LIMIT}`);
  }
  return { page, limit, offset: (page - 1) * limit };
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new DomainError(400, `${field} es obligatorio y debe ser un string no vacío`);
  }
  return value.trim();
}

function requirePositiveInt(value: unknown, field: string): number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new DomainError(400, `${field} debe ser un entero positivo`);
  }
  return value as number;
}

function requireEdad(value: unknown): number {
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 0 || n > 120 || !Number.isInteger(n)) {
    throw new DomainError(400, 'edad debe ser un entero entre 0 y 120');
  }
  return n;
}

function requireNivel(value: unknown): PlayerNivel {
  if (typeof value !== 'string' || !NIVELES_VALIDOS.includes(value as PlayerNivel)) {
    throw new DomainError(400, `nivel debe ser uno de: ${NIVELES_VALIDOS.join(', ')}`);
  }
  return value as PlayerNivel;
}

export const playersService = {
  async list(rawPage: unknown, rawLimit: unknown): Promise<PaginatedResponse<Player>> {
    const { page, limit, offset } = parsePagination(rawPage, rawLimit);
    const all = await playersRepository.findAll();
    return { data: all.slice(offset, offset + limit), total: all.length, page, limit };
  },

  async getById(id: number): Promise<Player> {
    requirePositiveInt(id, 'id');
    const p = await playersRepository.findById(id);
    if (!p) throw new DomainError(404, `Player ${id} not found`);
    return p;
  },

  async create(payload: unknown): Promise<Player> {
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: CreatePlayerDto = {
      nombre: requireString(body.nombre, 'nombre'),
      alias: requireString(body.alias, 'alias'),
      edad: requireEdad(body.edad),
    };
    if (body.nivel !== undefined) dto.nivel = requireNivel(body.nivel);

    return playersRepository.create(dto);
  },

  async update(id: number, payload: unknown): Promise<Player> {
    requirePositiveInt(id, 'id');
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: UpdatePlayerDto = {};
    if (body.nombre !== undefined) dto.nombre = requireString(body.nombre, 'nombre');
    if (body.alias !== undefined) dto.alias = requireString(body.alias, 'alias');
    if (body.edad !== undefined) dto.edad = requireEdad(body.edad);
    if (body.nivel !== undefined) dto.nivel = requireNivel(body.nivel);
    if (Object.keys(dto).length === 0) {
      throw new DomainError(400, 'Debe enviar al menos un campo para actualizar');
    }

    const updated = await playersRepository.update(id, dto);
    if (!updated) throw new DomainError(404, `Player ${id} not found`);
    return updated;
  },

  async remove(id: number): Promise<void> {
    requirePositiveInt(id, 'id');
    const ok = await playersRepository.delete(id);
    if (!ok) throw new DomainError(404, `Player ${id} not found`);
  },
};
