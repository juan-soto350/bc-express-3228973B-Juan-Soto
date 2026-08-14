// Capa de Service: paginación y validaciones de dominio.

import { maintenanceRepository } from '../repositories/maintenance.repository';
import { CreateMaintenanceDto, Maintenance, PaginatedResponse, UpdateMaintenanceDto } from '../types';

export class DomainError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

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

function requireFecha(value: unknown): string {
  const fecha = requireString(value, 'fecha');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new DomainError(400, 'fecha debe tener formato YYYY-MM-DD');
  }
  return fecha;
}

export const maintenanceService = {
  async list(rawPage: unknown, rawLimit: unknown): Promise<PaginatedResponse<Maintenance>> {
    const { page, limit, offset } = parsePagination(rawPage, rawLimit);
    const all = await maintenanceRepository.findAll();
    return { data: all.slice(offset, offset + limit), total: all.length, page, limit };
  },

  async getById(id: number): Promise<Maintenance> {
    requirePositiveInt(id, 'id');
    const m = await maintenanceRepository.findById(id);
    if (!m) throw new DomainError(404, `Maintenance ${id} not found`);
    return m;
  },

  async create(payload: unknown): Promise<Maintenance> {
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: CreateMaintenanceDto = {
      machineId: requirePositiveInt(body.machineId, 'machineId'),
      tecnico: requireString(body.tecnico, 'tecnico'),
      descripcion: requireString(body.descripcion, 'descripcion'),
      fecha: requireFecha(body.fecha),
      costo: requireNonNegativeInt(body.costo, 'costo'),
    };

    return maintenanceRepository.create(dto);
  },

  async update(id: number, payload: unknown): Promise<Maintenance> {
    requirePositiveInt(id, 'id');
    if (typeof payload !== 'object' || payload === null) {
      throw new DomainError(400, 'Body inválido');
    }
    const body = payload as Record<string, unknown>;

    const dto: UpdateMaintenanceDto = {};
    if (body.machineId !== undefined) {
      dto.machineId = requirePositiveInt(body.machineId, 'machineId');
    }
    if (body.tecnico !== undefined) dto.tecnico = requireString(body.tecnico, 'tecnico');
    if (body.descripcion !== undefined) dto.descripcion = requireString(body.descripcion, 'descripcion');
    if (body.fecha !== undefined) dto.fecha = requireFecha(body.fecha);
    if (body.costo !== undefined) dto.costo = requireNonNegativeInt(body.costo, 'costo');
    if (Object.keys(dto).length === 0) {
      throw new DomainError(400, 'Debe enviar al menos un campo para actualizar');
    }

    const updated = await maintenanceRepository.update(id, dto);
    if (!updated) throw new DomainError(404, `Maintenance ${id} not found`);
    return updated;
  },

  async remove(id: number): Promise<void> {
    requirePositiveInt(id, 'id');
    const ok = await maintenanceRepository.delete(id);
    if (!ok) throw new DomainError(404, `Maintenance ${id} not found`);
  },
};
