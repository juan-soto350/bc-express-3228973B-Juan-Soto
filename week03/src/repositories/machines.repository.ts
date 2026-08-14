// Capa de Repository: única capa que toca el store.

import { CreateMachineDto, Machine, UpdateMachineDto } from '../types';

const store: Map<number, Machine> = new Map();
let nextId = 1;

function clone(m: Machine): Machine {
  return { ...m };
}

function seed(): void {
  if (store.size > 0) return;

  const samples: CreateMachineDto[] = [
    { nombre: 'Street Fighter II', tipo: 'Pelea', precioPorFicha: 500, estado: 'activa', ultimoMantenimiento: '2025-01-10' },
    { nombre: 'Pac-Man', tipo: 'Clasico', precioPorFicha: 300, estado: 'activa', ultimoMantenimiento: '2025-02-01' },
    { nombre: 'Mortal Kombat', tipo: 'Pelea', precioPorFicha: 500, estado: 'mantenimiento', ultimoMantenimiento: '2025-03-15' },
    { nombre: 'Space Invaders', tipo: 'Clasico', precioPorFicha: 300, estado: 'inactiva', ultimoMantenimiento: '2024-11-20' },
    { nombre: 'Tekken 7', tipo: 'Pelea', precioPorFicha: 600, estado: 'activa', ultimoMantenimiento: '2025-04-05' },
    { nombre: 'Dance Dance Revolution', tipo: 'Ritmo', precioPorFicha: 700, estado: 'activa', ultimoMantenimiento: '2025-03-28' },
    { nombre: 'Marvel vs Capcom', tipo: 'Pelea', precioPorFicha: 500, estado: 'mantenimiento', ultimoMantenimiento: '2025-02-14' },
    { nombre: 'Galaga', tipo: 'Clasico', precioPorFicha: 300, estado: 'activa', ultimoMantenimiento: '2025-01-30' },
    { nombre: 'Initial D', tipo: 'Carreras', precioPorFicha: 800, estado: 'activa', ultimoMantenimiento: '2025-04-10' },
    { nombre: 'House of the Dead', tipo: 'Disparos', precioPorFicha: 600, estado: 'inactiva', ultimoMantenimiento: '2024-12-05' },
    { nombre: 'Guitar Hero Arcade', tipo: 'Ritmo', precioPorFicha: 700, estado: 'activa', ultimoMantenimiento: '2025-03-20' },
    { nombre: 'Metal Slug', tipo: 'Disparos', precioPorFicha: 500, estado: 'activa', ultimoMantenimiento: '2025-02-25' },
  ];

  for (const s of samples) {
    const id = nextId++;
    const m: Machine = {
      id,
      nombre: s.nombre,
      tipo: s.tipo,
      precioPorFicha: s.precioPorFicha,
      estado: s.estado ?? 'activa',
      ultimoMantenimiento: s.ultimoMantenimiento ?? new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    store.set(id, m);
  }
}

seed();

export const machinesRepository = {
  async findAll(): Promise<Machine[]> {
    return Array.from(store.values()).map(clone);
  },

  async findById(id: number): Promise<Machine | null> {
    const m = store.get(id);
    return m ? clone(m) : null;
  },

  async create(data: CreateMachineDto): Promise<Machine> {
    const id = nextId++;
    const m: Machine = {
      id,
      nombre: data.nombre,
      tipo: data.tipo,
      precioPorFicha: data.precioPorFicha,
      estado: data.estado ?? 'activa',
      ultimoMantenimiento: data.ultimoMantenimiento ?? new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    store.set(id, m);
    return clone(m);
  },

  async update(id: number, data: UpdateMachineDto): Promise<Machine | null> {
    const current = store.get(id);
    if (!current) return null;
    const updated: Machine = {
      ...current,
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.tipo !== undefined && { tipo: data.tipo }),
      ...(data.precioPorFicha !== undefined && { precioPorFicha: data.precioPorFicha }),
      ...(data.estado !== undefined && { estado: data.estado }),
      ...(data.ultimoMantenimiento !== undefined && { ultimoMantenimiento: data.ultimoMantenimiento }),
    };
    store.set(id, updated);
    return clone(updated);
  },

  async delete(id: number): Promise<boolean> {
    return store.delete(id);
  },
};
