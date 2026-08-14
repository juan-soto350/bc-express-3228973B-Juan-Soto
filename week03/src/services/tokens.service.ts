// Capa de Service: paginación y validaciones de dominio.

import { tokensRepository } from '../repositories/tokens.repository';
import { CreateTokenDto, PaginatedResponse, Token, TokenEstado, UpdateTokenDto } from '../types';

export class DomainError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const ESTADOS_VALIDOS: TokenEstado[] = ['activo', 'usado', 'expirado'];

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

function requireNonNegativeInt(value: unknown, field: string): number {
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    throw new DomainError(400, `${field} debe ser un entero >= 0`);
  }
  return n;
}

function requireEstado(value: unknown): TokenEstado {
  if (typeof value !== 'string' || !ESTADOS_VALIDOS.includes(value as TokenEstado)) {
    throw new DomainError(400, `estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  return value as TokenEstado;
}

export const tokensService = {
  async list(rawPage: unknown, rawLimit: unknown): Promise<PaginatedResponse<Token>> {
    const { page, limit, offset } = parsePagination(rawPage, rawLimit);
    const all = await tokensRepository.findAll();
    return { data: all.slice(offset, offset + limit), total: all.length, page, limit };
  },

  async getById(id: number): Promise<Token> {
    requirePositiveInt(id, 'id');
    const t = await tokensRepository.findById(id);
    if (!t) throw new DomainError(404, `Token ${id} not found`);
    return t;
  },

  async create(payload: unknown): Promise<Token> {
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: CreateTokenDto = {
      codigo: requireString(body.codigo, 'codigo'),
      cantidad: requireNonNegativeInt(body.cantidad, 'cantidad'),
      machineId: requirePositiveInt(body.machineId, 'machineId'),
      playerId: requirePositiveInt(body.playerId, 'playerId'),
    };
    if (body.estado !== undefined) dto.estado = requireEstado(body.estado);

    return tokensRepository.create(dto);
  },

  async update(id: number, payload: unknown): Promise<Token> {
    requirePositiveInt(id, 'id');
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: UpdateTokenDto = {};
    if (body.codigo !== undefined) dto.codigo = requireString(body.codigo, 'codigo');
    if (body.cantidad !== undefined) {
      dto.cantidad = requireNonNegativeInt(body.cantidad, 'cantidad');
    }
    if (body.machineId !== undefined) {
      dto.machineId = requirePositiveInt(body.machineId, 'machineId');
    }
    if (body.playerId !== undefined) {
      dto.playerId = requirePositiveInt(body.playerId, 'playerId');
    }
    if (body.estado !== undefined) dto.estado = requireEstado(body.estado);
    if (Object.keys(dto).length === 0) {
      throw new DomainError(400, 'Debe enviar al menos un campo para actualizar');
    }

    const updated = await tokensRepository.update(id, dto);
    if (!updated) throw new DomainError(404, `Token ${id} not found`);
    return updated;
  },

  async remove(id: number): Promise<void> {
    requirePositiveInt(id, 'id');
    const ok = await tokensRepository.delete(id);
    if (!ok) throw new DomainError(404, `Token ${id} not found`);
  },
};
