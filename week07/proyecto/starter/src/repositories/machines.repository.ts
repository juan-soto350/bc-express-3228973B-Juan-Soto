import { MachineModel, IMachine } from '../models/machine.model';
import { CreateMachineDto, UpdateMachineDto } from '../schemas/machine.schema';

export async function findAll(): Promise<IMachine[]> {
  return MachineModel.find().populate('agregadoPor', 'name email');
}

export async function findById(id: string): Promise<IMachine | null> {
  return MachineModel.findById(id).populate('agregadoPor', 'name email');
}

export async function create(data: CreateMachineDto & { agregadoPor: string }): Promise<IMachine> {
  return MachineModel.create(data);
}

export async function updateById(
  id: string,
  data: UpdateMachineDto
): Promise<IMachine | null> {
  return MachineModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await MachineModel.findByIdAndDelete(id);
  return result !== null;
}
