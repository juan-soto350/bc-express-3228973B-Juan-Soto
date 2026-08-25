import * as playersRepository from '../repositories/players.repository';
import type { CreatePlayerDto, UpdatePlayerDto } from '../schemas/player.schema';

export function findAll(page: number, limit: number, search?: string) {
  return playersRepository.findAll(page, limit, search);
}

export function findById(id: string) {
  return playersRepository.findById(id);
}

export function create(dto: CreatePlayerDto) {
  return playersRepository.create(dto);
}

export function update(id: string, dto: UpdatePlayerDto) {
  return playersRepository.update(id, dto);
}

export function remove(id: string) {
  return playersRepository.remove(id);
}
