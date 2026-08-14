// Capa de Repository: única capa que toca el store.

import { CreateMaintenanceDto, Maintenance, UpdateMaintenanceDto } from '../types';

const store: Map<number, Maintenance> = new Map();
let nextId = 1;

function clone(m: Maintenance): Maintenance {
  return { ...m };
}

function seed(): void {
  if (store.size > 0) return;

  const samples: CreateMaintenanceDto[] = [
    { machineId: 3, tecnico: 'Jorge Peña', descripcion: 'Cambio de palancas y botones del panel', fecha: '2025-03-14', costo: 150000 },
    { machineId: 7, tecnico: 'Lucía Ferrer', descripcion: 'Reparación de pantalla CRT y ajuste de sonido', fecha: '2025-02-12', costo: 220000 },
    { machineId: 10, tecnico: 'Andrés Vidal', descripcion: 'Mantenimiento preventivo del cañón de luz', fecha: '2024-12-03', costo: 180000 },
    { machineId: 1, tecnico: 'Jorge Peña', descripcion: 'Lubricación de joysticks y limpieza interna', fecha: '2025-01-08', costo: 90000 },
    { machineId: 6, tecnico: 'Lucía Ferrer', descripcion: 'Reposición de tapetes de baile y sensores', fecha: '2025-03-25', costo: 310000 },
    { machineId: 9, tecnico: 'Andrés Vidal', descripcion: 'Calibración de volante y pedales', fecha: '2025-04-08', costo: 130000 },
  ];

  for (const s of samples) {
    const id = nextId++;
    const m: Maintenance = {
      id,
      machineId: s.machineId,
      tecnico: s.tecnico,
      descripcion: s.descripcion,
      fecha: s.fecha,
      costo: s.costo,
      createdAt: new Date().toISOString(),
    };
    store.set(id, m);
  }
}

seed();

export const maintenanceRepository = {
  async findAll(): Promise<Maintenance[]> {
    return Array.from(store.values()).map(clone);
  },

  async findById(id: number): Promise<Maintenance | null> {
    const m = store.get(id);
    return m ? clone(m) : null;
  },

  async findByMachineId(machineId: number): Promise<Maintenance[]> {
    return Array.from(store.values())
      .filter((m) => m.machineId === machineId)
      .map(clone);
  },

  async create(data: CreateMaintenanceDto): Promise<Maintenance> {
    const id = nextId++;
    const m: Maintenance = {
      id,
      machineId: data.machineId,
      tecnico: data.tecnico,
      descripcion: data.descripcion,
      fecha: data.fecha,
      costo: data.costo,
      createdAt: new Date().toISOString(),
    };
    store.set(id, m);
    return clone(m);
  },

  async update(id: number, data: UpdateMaintenanceDto): Promise<Maintenance | null> {
    const current = store.get(id);
    if (!current) return null;
    const updated: Maintenance = {
      ...current,
      ...(data.machineId !== undefined && { machineId: data.machineId }),
      ...(data.tecnico !== undefined && { tecnico: data.tecnico }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
      ...(data.fecha !== undefined && { fecha: data.fecha }),
      ...(data.costo !== undefined && { costo: data.costo }),
    };
    store.set(id, updated);
    return clone(updated);
  },

  async delete(id: number): Promise<boolean> {
    return store.delete(id);
  },
};
