import { Machine, IMachine } from '../models/machine.model.js';
import type { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema.js';
import { AppError } from '../errors/AppError.js';

export async function findAll(): Promise<IMachine[]> {
  return Machine.find({ active: true }).sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IMachine | null> {
  return Machine.findById(id);
}

export async function create(data: CreateMachineDto, userId: string): Promise<IMachine> {
  // Validación de negocio: coherencia entre estado y disponibilidad
  if (data.estado === 'en_reparacion' && data.disponible === true) {
    throw new AppError(400, 'Una máquina en reparación no puede estar disponible');
  }
  if (data.estado === 'retirada' && data.disponible === true) {
    throw new AppError(400, 'Una máquina retirada no puede estar disponible');
  }

  return Machine.create({ ...data, createdBy: userId });
}

export async function update(
  id: string,
  data: UpdateMachineDto,
  requesterId: string,
  requesterRole: string
): Promise<IMachine | null> {
  const machine = await Machine.findById(id);
  if (!machine) return null;

  // RBAC: solo el dueño O un admin puede actualizar
  if (requesterRole !== 'admin' && machine.createdBy !== requesterId) {
    throw new AppError(403, 'Solo puedes actualizar tus propias máquinas');
  }

  // Validación de negocio
  const nuevoEstado = data.estado ?? machine.estado;
  const nuevaDisponible = data.disponible ?? machine.disponible;

  if (nuevoEstado === 'en_reparacion' && nuevaDisponible === true) {
    throw new AppError(400, 'Una máquina en reparación no puede estar disponible');
  }
  if (nuevoEstado === 'retirada' && nuevaDisponible === true) {
    throw new AppError(400, 'Una máquina retirada no puede estar disponible');
  }

  return Machine.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IMachine | null> {
  // Solo admin puede eliminar (enforced en routes con requireRole)
  return Machine.findByIdAndDelete(id);
}
