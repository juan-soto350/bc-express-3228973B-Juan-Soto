import { AppError } from '../errors/AppError.js';
import type { CreateMachineDto, UpdateMachineDto } from '../types/index.js';
import type { IMachine } from '../models/machine.model.js';
import * as machinesRepo from '../repositories/machines.repository.js';

// ============================================================
// MACHINES SERVICE — lógica de negocio del recurso principal
// ============================================================
// Dominio: Sala de videojuegos / Arcade
// Reglas de negocio:
//   - El nombre de la máquina es único en la sala (409)
//   - Una máquina en_reparacion o retirada no puede estar disponible (400)
//   - Solo el creador o un admin puede actualizar/eliminar (403)
// ============================================================

export async function getAll(): Promise<IMachine[]> {
  return machinesRepo.findAllMachines();
}

export async function getById(id: string): Promise<IMachine> {
  const machine = await machinesRepo.findMachineById(id);
  if (!machine) throw new AppError(404, 'Máquina no encontrada');
  return machine;
}

export async function create(dto: CreateMachineDto, createdBy: string): Promise<IMachine> {
  const existing = await machinesRepo.findMachineByNombre(dto.nombre);
  if (existing) throw new AppError(409, 'Ya existe una máquina con ese nombre');

  if (dto.estado !== 'operativa' && dto.disponible) {
    throw new AppError(400, 'Una máquina no operativa no puede estar disponible');
  }

  return machinesRepo.createMachine(dto, createdBy);
}

export async function update(
  id: string,
  dto: UpdateMachineDto,
  requesterId: string,
  requesterRole: string,
): Promise<IMachine> {
  const existing = await machinesRepo.findMachineById(id);
  if (!existing) throw new AppError(404, 'Máquina no encontrada');

  // Solo el creador o un admin puede actualizar
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  // Coherencia estado vs disponibilidad (considerando valores efectivos)
  const estado = dto.estado ?? existing.estado;
  const disponible = dto.disponible ?? existing.disponible;
  if (estado !== 'operativa' && disponible) {
    throw new AppError(400, 'Una máquina no operativa no puede estar disponible');
  }

  const updated = await machinesRepo.updateMachine(id, dto);
  if (!updated) throw new AppError(404, 'Máquina no encontrada');
  return updated;
}

export async function remove(
  id: string,
  requesterId: string,
  requesterRole: string,
): Promise<void> {
  const existing = await machinesRepo.findMachineById(id);
  if (!existing) throw new AppError(404, 'Máquina no encontrada');

  // Solo el creador o un admin puede eliminar
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  await machinesRepo.deleteMachine(id);
}
