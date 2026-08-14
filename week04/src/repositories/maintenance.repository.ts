// ============================================
// REPOSITORY — única capa que toca el store (maintenance)
// ============================================
import { Maintenance } from '../types';

export type CreateMaintenanceRepoDto = Omit<Maintenance, 'id' | 'createdAt'>;
export type UpdateMaintenanceRepoDto = Partial<CreateMaintenanceRepoDto>;

let maintenanceRecords: Maintenance[] = [
  { id: 1, machineId: 3, tecnico: 'Jorge Peña', descripcion: 'Cambio de palancas y botones del panel', fecha: '2025-03-14', costo: 150000, createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 2, machineId: 7, tecnico: 'Lucía Ferrer', descripcion: 'Reparación de pantalla CRT y ajuste de sonido', fecha: '2025-02-12', costo: 220000, createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 3, machineId: 10, tecnico: 'Andrés Vidal', descripcion: 'Mantenimiento preventivo del cañón de luz', fecha: '2024-12-03', costo: 180000, createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 4, machineId: 1, tecnico: 'Jorge Peña', descripcion: 'Lubricación de joysticks y limpieza interna', fecha: '2025-01-08', costo: 90000, createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 5, machineId: 6, tecnico: 'Lucía Ferrer', descripcion: 'Reposición de tapetes de baile y sensores', fecha: '2025-03-25', costo: 310000, createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 6, machineId: 9, tecnico: 'Andrés Vidal', descripcion: 'Calibración de volante y pedales', fecha: '2025-04-08', costo: 130000, createdAt: new Date('2026-08-01T10:00:00.000Z') },
];

let nextId = 7;

export async function findAll(): Promise<Maintenance[]> {
  return maintenanceRecords.map((m) => ({ ...m }));
}

export async function findById(id: number): Promise<Maintenance | undefined> {
  const record = maintenanceRecords.find((m) => m.id === id);
  return record ? { ...record } : undefined;
}

export async function create(dto: CreateMaintenanceRepoDto): Promise<Maintenance> {
  const record: Maintenance = {
    id: nextId++,
    machineId: dto.machineId,
    tecnico: dto.tecnico,
    descripcion: dto.descripcion,
    fecha: dto.fecha,
    costo: dto.costo,
    createdAt: new Date(),
  };
  maintenanceRecords.push(record);
  return { ...record };
}

export async function update(id: number, dto: UpdateMaintenanceRepoDto): Promise<Maintenance | undefined> {
  const index = maintenanceRecords.findIndex((m) => m.id === id);
  if (index === -1) return undefined;
  maintenanceRecords[index] = {
    ...maintenanceRecords[index]!,
    ...(dto.machineId !== undefined && { machineId: dto.machineId }),
    ...(dto.tecnico !== undefined && { tecnico: dto.tecnico }),
    ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
    ...(dto.fecha !== undefined && { fecha: dto.fecha }),
    ...(dto.costo !== undefined && { costo: dto.costo }),
  };
  return { ...maintenanceRecords[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = maintenanceRecords.findIndex((m) => m.id === id);
  if (index === -1) return false;
  maintenanceRecords.splice(index, 1);
  return true;
}
