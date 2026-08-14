// ============================================
// REPOSITORY — única capa que toca el store (machines)
// ============================================
import { Machine, MachineEstado } from '../types';

export type CreateMachineRepoDto = Omit<Machine, 'id' | 'createdAt' | 'estado' | 'ultimoMantenimiento'> & {
  estado?: MachineEstado;
  ultimoMantenimiento?: string;
};
export type UpdateMachineRepoDto = Partial<CreateMachineRepoDto>;

let machines: Machine[] = [
  { id: 1, nombre: 'Street Fighter II', tipo: 'Pelea', precioPorFicha: 500, estado: 'activa', ultimoMantenimiento: '2025-01-10', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 2, nombre: 'Pac-Man', tipo: 'Clasico', precioPorFicha: 300, estado: 'activa', ultimoMantenimiento: '2025-02-01', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 3, nombre: 'Mortal Kombat', tipo: 'Pelea', precioPorFicha: 500, estado: 'mantenimiento', ultimoMantenimiento: '2025-03-15', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 4, nombre: 'Space Invaders', tipo: 'Clasico', precioPorFicha: 300, estado: 'inactiva', ultimoMantenimiento: '2024-11-20', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 5, nombre: 'Tekken 7', tipo: 'Pelea', precioPorFicha: 600, estado: 'activa', ultimoMantenimiento: '2025-04-05', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 6, nombre: 'Dance Dance Revolution', tipo: 'Ritmo', precioPorFicha: 700, estado: 'activa', ultimoMantenimiento: '2025-03-28', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 7, nombre: 'Marvel vs Capcom', tipo: 'Pelea', precioPorFicha: 500, estado: 'mantenimiento', ultimoMantenimiento: '2025-02-14', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 8, nombre: 'Galaga', tipo: 'Clasico', precioPorFicha: 300, estado: 'activa', ultimoMantenimiento: '2025-01-30', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 9, nombre: 'Initial D', tipo: 'Carreras', precioPorFicha: 800, estado: 'activa', ultimoMantenimiento: '2025-04-10', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 10, nombre: 'House of the Dead', tipo: 'Disparos', precioPorFicha: 600, estado: 'inactiva', ultimoMantenimiento: '2024-12-05', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 11, nombre: 'Guitar Hero Arcade', tipo: 'Ritmo', precioPorFicha: 700, estado: 'activa', ultimoMantenimiento: '2025-03-20', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 12, nombre: 'Metal Slug', tipo: 'Disparos', precioPorFicha: 500, estado: 'activa', ultimoMantenimiento: '2025-02-25', createdAt: new Date('2026-08-01T10:00:00.000Z') },
];

let nextId = 13;

export async function findAll(): Promise<Machine[]> {
  return machines.map((m) => ({ ...m }));
}

export async function findById(id: number): Promise<Machine | undefined> {
  const machine = machines.find((m) => m.id === id);
  return machine ? { ...machine } : undefined;
}

export async function create(dto: CreateMachineRepoDto): Promise<Machine> {
  const machine: Machine = {
    id: nextId++,
    nombre: dto.nombre,
    tipo: dto.tipo,
    precioPorFicha: dto.precioPorFicha,
    estado: dto.estado ?? 'activa',
    ultimoMantenimiento: dto.ultimoMantenimiento ?? new Date().toISOString().slice(0, 10),
    createdAt: new Date(),
  };
  machines.push(machine);
  return { ...machine };
}

export async function update(id: number, dto: UpdateMachineRepoDto): Promise<Machine | undefined> {
  const index = machines.findIndex((m) => m.id === id);
  if (index === -1) return undefined;
  machines[index] = {
    ...machines[index]!,
    ...(dto.nombre !== undefined && { nombre: dto.nombre }),
    ...(dto.tipo !== undefined && { tipo: dto.tipo }),
    ...(dto.precioPorFicha !== undefined && { precioPorFicha: dto.precioPorFicha }),
    ...(dto.estado !== undefined && { estado: dto.estado }),
    ...(dto.ultimoMantenimiento !== undefined && { ultimoMantenimiento: dto.ultimoMantenimiento }),
  };
  return { ...machines[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = machines.findIndex((m) => m.id === id);
  if (index === -1) return false;
  machines.splice(index, 1);
  return true;
}
