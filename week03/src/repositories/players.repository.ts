// Capa de Repository: única capa que toca el store.

import { CreatePlayerDto, Player, UpdatePlayerDto } from '../types';

const store: Map<number, Player> = new Map();
let nextId = 1;

function clone(p: Player): Player {
  return { ...p };
}

function seed(): void {
  if (store.size > 0) return;
  const samples: CreatePlayerDto[] = [
    { nombre: 'Carlos Ramirez', alias: 'carlosr', edad: 22, nivel: 'intermedio' },
    { nombre: 'Ana Torres', alias: 'anatorres', edad: 19, nivel: 'principiante' },
    { nombre: 'Luis Mendoza', alias: 'luism', edad: 30, nivel: 'experto' },
  ];
  for (const s of samples) {
    const id = nextId++;
    const p: Player = {
      id,
      nombre: s.nombre,
      alias: s.alias,
      edad: s.edad,
      nivel: s.nivel ?? 'principiante',
      createdAt: new Date().toISOString(),
    };
    store.set(id, p);
  }
}

seed();

export const playersRepository = {
  async findAll(): Promise<Player[]> {
    return Array.from(store.values()).map(clone);
  },

  async findById(id: number): Promise<Player | null> {
    const p = store.get(id);
    return p ? clone(p) : null;
  },

  async create(data: CreatePlayerDto): Promise<Player> {
    const id = nextId++;
    const p: Player = {
      id,
      nombre: data.nombre,
      alias: data.alias,
      edad: data.edad,
      nivel: data.nivel ?? 'principiante',
      createdAt: new Date().toISOString(),
    };
    store.set(id, p);
    return clone(p);
  },

  async update(id: number, data: UpdatePlayerDto): Promise<Player | null> {
    const current = store.get(id);
    if (!current) return null;
    const updated: Player = {
      ...current,
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.alias !== undefined && { alias: data.alias }),
      ...(data.edad !== undefined && { edad: data.edad }),
      ...(data.nivel !== undefined && { nivel: data.nivel }),
    };
    store.set(id, updated);
    return clone(updated);
  },

  async delete(id: number): Promise<boolean> {
    return store.delete(id);
  },
};
