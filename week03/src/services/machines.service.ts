// Capa de Service: paginación y validaciones de dominio.

import { machinesRepository } from '../repositories/machines.repository';
import { CreateMachineDto, Machine, MachineEstado, PaginatedResponse, UpdateMachineDto } from '../types';

export class DomainError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const ESTADOS_VALIDOS: MachineEstado[] = ['activa', 'inactiva', 'mantenimiento'];

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

function requireNonNegativeInt(value: unknown, field: string): number {
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
    throw new DomainError(400, `${field} debe ser un entero >= 0`);
  }
  return n;
}

function requireEstado(value: unknown): MachineEstado {
  if (typeof value !== 'string' || !ESTADOS_VALIDOS.includes(value as MachineEstado)) {
    throw new DomainError(400, `estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }
  return value as MachineEstado;
}

function requirePositiveInt(value: unknown, field: string): number {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new DomainError(400, `${field} debe ser un entero positivo`);
  }
  return value as number;
}

export const machinesService = {
  async list(rawPage: unknown, rawLimit: unknown): Promise<PaginatedResponse<Machine>> {
    const { page, limit, offset } = parsePagination(rawPage, rawLimit);
    const all = await machinesRepository.findAll();
    return { data: all.slice(offset, offset + limit), total: all.length, page, limit };
  },

  async getById(id: number): Promise<Machine> {
    requirePositiveInt(id, 'id');
    const m = await machinesRepository.findById(id);
    if (!m) throw new DomainError(404, `Machine ${id} not found`);
    return m;
  },

  async create(payload: unknown): Promise<Machine> {
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: CreateMachineDto = {
      nombre: requireString(body.nombre, 'nombre'),
      tipo: requireString(body.tipo, 'tipo'),
      precioPorFicha: requireNonNegativeInt(body.precioPorFicha, 'precioPorFicha'),
    };
    if (body.estado !== undefined) dto.estado = requireEstado(body.estado);
    if (body.ultimoMantenimiento !== undefined) {
      dto.ultimoMantenimiento = requireString(body.ultimoMantenimiento, 'ultimoMantenimiento');
    }

    return machinesRepository.create(dto);
  },

  async update(id: number, payload: unknown): Promise<Machine> {
    requirePositiveInt(id, 'id');
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: UpdateMachineDto = {};
    if (body.nombre !== undefined) dto.nombre = requireString(body.nombre, 'nombre');
    if (body.tipo !== undefined) dto.tipo = requireString(body.tipo, 'tipo');
    if (body.precioPorFicha !== undefined) {
      dto.precioPorFicha = requireNonNegativeInt(body.precioPorFicha, 'precioPorFicha');
    }
    if (body.estado !== undefined) dto.estado = requireEstado(body.estado);
    if (body.ultimoMantenimiento !== undefined) {
      dto.ultimoMantenimiento = requireString(body.ultimoMantenimiento, 'ultimoMantenimiento');
    }
    if (Object.keys(dto).length === 0) {
      throw new DomainError(400, 'Debe enviar al menos un campo para actualizar');
    }

    const updated = await machinesRepository.update(id, dto);
    if (!updated) throw new DomainError(404, `Machine ${id} not found`);
    return updated;
  },

  async remove(id: number): Promise<void> {
    requirePositiveInt(id, 'id');
    const ok = await machinesRepository.delete(id);
    if (!ok) throw new DomainError(404, `Machine ${id} not found`);
  },
};
