// Capa de Repository: única capa que toca el store.

import { CreateTokenDto, Token, UpdateTokenDto } from '../types';

const store: Map<number, Token> = new Map();
let nextId = 1;

function clone(t: Token): Token {
  return { ...t };
}

function seed(): void {
  if (store.size > 0) return;
  const samples: CreateTokenDto[] = [
    { codigo: 'TKN-0001', cantidad: 5, machineId: 1, playerId: 1, estado: 'activo' },
    { codigo: 'TKN-0002', cantidad: 10, machineId: 5, playerId: 2, estado: 'activo' },
    { codigo: 'TKN-0003', cantidad: 15, machineId: 9, playerId: 3, estado: 'usado' },
  ];
  for (const s of samples) {
    const id = nextId++;
    const t: Token = {
      id,
      codigo: s.codigo,
      cantidad: s.cantidad,
      machineId: s.machineId,
      playerId: s.playerId,
      estado: s.estado ?? 'activo',
      createdAt: new Date().toISOString(),
    };
    store.set(id, t);
  }
}

seed();

export const tokensRepository = {
  async findAll(): Promise<Token[]> {
    return Array.from(store.values()).map(clone);
  },

  async findById(id: number): Promise<Token | null> {
    const t = store.get(id);
    return t ? clone(t) : null;
  },

  async create(data: CreateTokenDto): Promise<Token> {
    const id = nextId++;
    const t: Token = {
      id,
      codigo: data.codigo,
      cantidad: data.cantidad,
      machineId: data.machineId,
      playerId: data.playerId,
      estado: data.estado ?? 'activo',
      createdAt: new Date().toISOString(),
    };
    store.set(id, t);
    return clone(t);
  },

  async update(id: number, data: UpdateTokenDto): Promise<Token | null> {
    const current = store.get(id);
    if (!current) return null;
    const updated: Token = {
      ...current,
      ...(data.codigo !== undefined && { codigo: data.codigo }),
      ...(data.cantidad !== undefined && { cantidad: data.cantidad }),
      ...(data.machineId !== undefined && { machineId: data.machineId }),
      ...(data.playerId !== undefined && { playerId: data.playerId }),
      ...(data.estado !== undefined && { estado: data.estado }),
    };
    store.set(id, updated);
    return clone(updated);
  },

  async delete(id: number): Promise<boolean> {
    return store.delete(id);
  },
};
