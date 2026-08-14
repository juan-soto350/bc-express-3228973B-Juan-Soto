// ============================================
// REPOSITORY — única capa que toca el store (tokens)
// ============================================
import { Token, TokenEstado } from '../types';

export type CreateTokenRepoDto = Omit<Token, 'id' | 'createdAt' | 'estado'> & {
  estado?: TokenEstado;
};
export type UpdateTokenRepoDto = Partial<CreateTokenRepoDto>;

let tokens: Token[] = [
  { id: 1, codigo: 'TKN-0001', cantidad: 5, machineId: 1, playerId: 1, estado: 'activo', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 2, codigo: 'TKN-0002', cantidad: 10, machineId: 5, playerId: 2, estado: 'activo', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 3, codigo: 'TKN-0003', cantidad: 15, machineId: 9, playerId: 3, estado: 'usado', createdAt: new Date('2026-08-01T10:00:00.000Z') },
];

let nextId = 4;

export async function findAll(): Promise<Token[]> {
  return tokens.map((t) => ({ ...t }));
}

export async function findById(id: number): Promise<Token | undefined> {
  const token = tokens.find((t) => t.id === id);
  return token ? { ...token } : undefined;
}

export async function findByCodigo(codigo: string): Promise<Token | undefined> {
  const token = tokens.find((t) => t.codigo === codigo);
  return token ? { ...token } : undefined;
}

export async function create(dto: CreateTokenRepoDto): Promise<Token> {
  const token: Token = {
    id: nextId++,
    codigo: dto.codigo,
    cantidad: dto.cantidad,
    machineId: dto.machineId,
    playerId: dto.playerId,
    estado: dto.estado ?? 'activo',
    createdAt: new Date(),
  };
  tokens.push(token);
  return { ...token };
}

export async function update(id: number, dto: UpdateTokenRepoDto): Promise<Token | undefined> {
  const index = tokens.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  tokens[index] = {
    ...tokens[index]!,
    ...(dto.codigo !== undefined && { codigo: dto.codigo }),
    ...(dto.cantidad !== undefined && { cantidad: dto.cantidad }),
    ...(dto.machineId !== undefined && { machineId: dto.machineId }),
    ...(dto.playerId !== undefined && { playerId: dto.playerId }),
    ...(dto.estado !== undefined && { estado: dto.estado }),
  };
  return { ...tokens[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = tokens.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tokens.splice(index, 1);
  return true;
}
