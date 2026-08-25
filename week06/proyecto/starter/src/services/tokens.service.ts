import * as tokensRepository from '../repositories/tokens.repository';
import type { CreateTokenDto, UpdateTokenDto } from '../schemas/token.schema';

export function findAll(page: number, limit: number) {
  return tokensRepository.findAll(page, limit);
}

export function findById(id: string) {
  return tokensRepository.findById(id);
}

export function create(dto: CreateTokenDto) {
  return tokensRepository.create(dto);
}

export function update(id: string, dto: UpdateTokenDto) {
  return tokensRepository.update(id, dto);
}

export function remove(id: string) {
  return tokensRepository.remove(id);
}
