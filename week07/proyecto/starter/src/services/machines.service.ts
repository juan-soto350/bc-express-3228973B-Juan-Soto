import { IMachine } from '../models/machine.model';
import * as machinesRepository from '../repositories/machines.repository';
import { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema';
import { AppError } from '../errors/AppError';

export async function getAll(): Promise<IMachine[]> {
  return machinesRepository.findAll();
}

export async function getById(id: string): Promise<IMachine> {
  const machine = await machinesRepository.findById(id);
  if (!machine) throw new AppError(404, 'Máquina no encontrada');
  return machine;
}

export async function create(
  dto: CreateMachineDto,
  userId: string
): Promise<IMachine> {
  // Validación de negocio: si la máquina está marcada como no disponible,
  // verificar que tenga un estado coherente
  if (dto.disponible === false && dto.estado === 'operativa') {
    throw new AppError(400, 'Una máquina operativa debe estar disponible');
  }

  return machinesRepository.create({ ...dto, agregadoPor: userId });
}

export async function update(
  id: string,
  dto: UpdateMachineDto
): Promise<IMachine> {
  const existing = await machinesRepository.findById(id);
  if (!existing) throw new AppError(404, 'Máquina no encontrada');

  // Validación de negocio: coherencia entre estado y disponibilidad
  if (dto.estado === 'en_reparacion' && dto.disponible === true) {
    throw new AppError(400, 'Una máquina en reparación no puede estar disponible');
  }
  if (dto.estado === 'retirada' && dto.disponible === true) {
    throw new AppError(400, 'Una máquina retirada no puede estar disponible');
  }

  const updated = await machinesRepository.updateById(id, dto);
  if (!updated) throw new AppError(404, 'Máquina no encontrada');
  return updated;
}

export async function remove(id: string): Promise<void> {
  const deleted = await machinesRepository.deleteById(id);
  if (!deleted) throw new AppError(404, 'Máquina no encontrada');
}
