import { MachineModel, type IMachine } from '../models/machine.model.js';
import type { CreateMachineDto, UpdateMachineDto } from '../types/index.js';

// ============================================================
// REPOSITORIO DE MÁQUINAS — capa de acceso a datos
// ============================================================
// En los unit tests, ESTE módulo se mockea con jest.mock().
// En los integration tests, accede a MongoDB Memory Server.
// ============================================================

export async function findAllMachines(): Promise<IMachine[]> {
  return MachineModel.find().sort({ createdAt: -1 }).lean<IMachine[]>().exec();
}

export async function findMachineById(id: string): Promise<IMachine | null> {
  return MachineModel.findById(id).lean<IMachine>().exec();
}

export async function findMachineByNombre(nombre: string): Promise<IMachine | null> {
  return MachineModel.findOne({ nombre }).lean<IMachine>().exec();
}

export async function createMachine(
  dto: CreateMachineDto,
  createdBy: string,
): Promise<IMachine> {
  const machine = new MachineModel({ ...dto, createdBy });
  const saved = await machine.save();
  return saved.toObject() as unknown as IMachine;
}

export async function updateMachine(
  id: string,
  dto: UpdateMachineDto,
): Promise<IMachine | null> {
  return MachineModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true })
    .lean<IMachine>()
    .exec();
}

export async function deleteMachine(id: string): Promise<IMachine | null> {
  return MachineModel.findByIdAndDelete(id).lean<IMachine>().exec();
}
