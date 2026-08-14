// ============================================
// REPOSITORY — única capa que toca el store (players)
// ============================================
import { Player, PlayerNivel } from '../types';

export type CreatePlayerRepoDto = Omit<Player, 'id' | 'createdAt' | 'nivel'> & {
  nivel?: PlayerNivel;
};
export type UpdatePlayerRepoDto = Partial<CreatePlayerRepoDto>;

let players: Player[] = [
  { id: 1, nombre: 'Carlos Ramirez', alias: 'carlosr', edad: 22, nivel: 'intermedio', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 2, nombre: 'Ana Torres', alias: 'anatorres', edad: 19, nivel: 'principiante', createdAt: new Date('2026-08-01T10:00:00.000Z') },
  { id: 3, nombre: 'Luis Mendoza', alias: 'luism', edad: 30, nivel: 'experto', createdAt: new Date('2026-08-01T10:00:00.000Z') },
];

let nextId = 4;

export async function findAll(): Promise<Player[]> {
  return players.map((p) => ({ ...p }));
}

export async function findById(id: number): Promise<Player | undefined> {
  const player = players.find((p) => p.id === id);
  return player ? { ...player } : undefined;
}

export async function findByAlias(alias: string): Promise<Player | undefined> {
  const player = players.find((p) => p.alias === alias);
  return player ? { ...player } : undefined;
}

export async function create(dto: CreatePlayerRepoDto): Promise<Player> {
  const player: Player = {
    id: nextId++,
    nombre: dto.nombre,
    alias: dto.alias,
    edad: dto.edad,
    nivel: dto.nivel ?? 'principiante',
    createdAt: new Date(),
  };
  players.push(player);
  return { ...player };
}

export async function update(id: number, dto: UpdatePlayerRepoDto): Promise<Player | undefined> {
  const index = players.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  players[index] = {
    ...players[index]!,
    ...(dto.nombre !== undefined && { nombre: dto.nombre }),
    ...(dto.alias !== undefined && { alias: dto.alias }),
    ...(dto.edad !== undefined && { edad: dto.edad }),
    ...(dto.nivel !== undefined && { nivel: dto.nivel }),
  };
  return { ...players[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = players.findIndex((p) => p.id === id);
  if (index === -1) return false;
  players.splice(index, 1);
  return true;
}
