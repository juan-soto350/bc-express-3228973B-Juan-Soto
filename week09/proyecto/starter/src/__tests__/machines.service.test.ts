// ============================================================
// UNIT TESTS — machines.service.ts (dominio: Arcade)
// ============================================================
// El repositorio se MOCKEA con jest.mock() — la DB nunca se toca.
// Se testea SOLO la lógica de negocio del servicio.
// ============================================================

import { AppError } from '../errors/AppError';
import type { CreateMachineDto, UpdateMachineDto } from '../types/index';

jest.mock('../repositories/machines.repository');

import * as machinesRepo from '../repositories/machines.repository';
import * as machinesService from '../services/machines.service';

const mockFindAll    = machinesRepo.findAllMachines    as jest.MockedFunction<typeof machinesRepo.findAllMachines>;
const mockFindById   = machinesRepo.findMachineById    as jest.MockedFunction<typeof machinesRepo.findMachineById>;
const mockFindByNombre = machinesRepo.findMachineByNombre as jest.MockedFunction<typeof machinesRepo.findMachineByNombre>;
const mockCreate     = machinesRepo.createMachine      as jest.MockedFunction<typeof machinesRepo.createMachine>;
const mockUpdate     = machinesRepo.updateMachine      as jest.MockedFunction<typeof machinesRepo.updateMachine>;
const mockDelete     = machinesRepo.deleteMachine      as jest.MockedFunction<typeof machinesRepo.deleteMachine>;

// Máquina base del dominio Arcade (coincide con lo que devolvería la DB)
const machineBase = {
  _id: 'machine-id-123',
  nombre: 'Pac-Man',
  fabricante: 'Namco',
  anio: 1980,
  tipoJuego: 'retro' as const,
  estado: 'operativa' as const,
  ubicacion: 'Zona A',
  tarifaPorHora: 3000,
  disponible: true,
  createdBy: 'user-id-abc',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const createDto: CreateMachineDto = {
  nombre: 'Street Fighter II',
  fabricante: 'Capcom',
  anio: 1991,
  tipoJuego: 'lucha',
  estado: 'operativa',
  ubicacion: 'Zona B',
  tarifaPorHora: 4000,
  disponible: true,
};

const updateDto: UpdateMachineDto = { tarifaPorHora: 5000 };

describe('MachinesService — Unit Tests (dominio Arcade)', () => {
  // ============================================================
  // getAll()
  // ============================================================
  describe('getAll()', () => {
    it('should return all machines', async () => {
      // ARRANGE
      mockFindAll.mockResolvedValue([machineBase, { ...machineBase, _id: 'otra-id', nombre: 'Galaga' }]);

      // ACT
      const result = await machinesService.getAll();

      // ASSERT
      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe('Pac-Man');
      expect(mockFindAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no machines exist', async () => {
      mockFindAll.mockResolvedValue([]);

      const result = await machinesService.getAll();

      expect(result).toEqual([]);
    });
  });

  // ============================================================
  // getById()
  // ============================================================
  describe('getById()', () => {
    it('should return the machine when found', async () => {
      mockFindById.mockResolvedValue(machineBase);

      const result = await machinesService.getById('machine-id-123');

      expect(result.nombre).toBe('Pac-Man');
      expect(mockFindById).toHaveBeenCalledWith('machine-id-123');
    });

    it('should throw AppError 404 when machine does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(machinesService.getById('no-existe')).rejects.toMatchObject({
        statusCode: 404,
      });
      await expect(machinesService.getById('no-existe')).rejects.toBeInstanceOf(AppError);
    });
  });

  // ============================================================
  // create()
  // ============================================================
  describe('create()', () => {
    it('should create and return the new machine', async () => {
      // ARRANGE — el nombre está disponible
      mockFindByNombre.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ ...machineBase, ...createDto, _id: 'nueva-id', createdBy: 'user-id-abc' });

      // ACT
      const result = await machinesService.create(createDto, 'user-id-abc');

      // ASSERT
      expect(result.nombre).toBe('Street Fighter II');
      expect(mockCreate).toHaveBeenCalledWith(createDto, 'user-id-abc');
    });

    it('should throw AppError 409 when machine name already exists', async () => {
      // ARRANGE — ya hay una máquina con ese nombre
      mockFindByNombre.mockResolvedValue({ ...machineBase, nombre: createDto.nombre });

      // ACT + ASSERT
      await expect(machinesService.create(createDto, 'user-id-abc')).rejects.toMatchObject({
        statusCode: 409,
      });
      // NUNCA debe llegar a crear
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('should throw AppError 400 when a non-operational machine is available', async () => {
      // ARRANGE — regla de negocio: en_reparacion + disponible=true es inválido
      mockFindByNombre.mockResolvedValue(null);
      const dtoInvalido: CreateMachineDto = { ...createDto, estado: 'en_reparacion', disponible: true };

      // ACT + ASSERT
      await expect(machinesService.create(dtoInvalido, 'user-id-abc')).rejects.toMatchObject({
        statusCode: 400,
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // update()
  // ============================================================
  describe('update()', () => {
    it('should update and return the machine when requester is the owner', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(machineBase);
      mockUpdate.mockResolvedValue({ ...machineBase, ...updateDto });

      // ACT
      const result = await machinesService.update('machine-id-123', updateDto, 'user-id-abc', 'user');

      // ASSERT
      expect(result.tarifaPorHora).toBe(5000);
      expect(mockUpdate).toHaveBeenCalledWith('machine-id-123', updateDto);
    });

    it('should throw AppError 404 when machine does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        machinesService.update('no-existe', updateDto, 'user-id-abc', 'user'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw AppError 403 when requester is not the owner', async () => {
      // ARRANGE — la máquina pertenece a otro usuario y quien pide no es admin
      mockFindById.mockResolvedValue(machineBase);

      // ACT + ASSERT
      await expect(
        machinesService.update('machine-id-123', updateDto, 'otro-usuario', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should allow admin to update a machine they do not own', async () => {
      mockFindById.mockResolvedValue(machineBase);
      mockUpdate.mockResolvedValue({ ...machineBase, ...updateDto });

      const result = await machinesService.update('machine-id-123', updateDto, 'admin-id', 'admin');

      expect(result.tarifaPorHora).toBe(5000);
    });

    it('should throw AppError 400 when update leaves a non-operational machine available', async () => {
      // ARRANGE — efectivo: estado=en_reparacion + disponible=true
      mockFindById.mockResolvedValue(machineBase);
      const dtoInvalido: UpdateMachineDto = { estado: 'en_reparacion' };

      // ACT + ASSERT
      await expect(
        machinesService.update('machine-id-123', dtoInvalido, 'user-id-abc', 'user'),
      ).rejects.toMatchObject({ statusCode: 400 });
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // remove()
  // ============================================================
  describe('remove()', () => {
    it('should delete the machine when requester is the owner', async () => {
      mockFindById.mockResolvedValue(machineBase);
      mockDelete.mockResolvedValue(machineBase);

      await expect(
        machinesService.remove('machine-id-123', 'user-id-abc', 'user'),
      ).resolves.toBeUndefined();

      expect(mockDelete).toHaveBeenCalledWith('machine-id-123');
    });

    it('should delete the machine when requester is admin', async () => {
      mockFindById.mockResolvedValue(machineBase);
      mockDelete.mockResolvedValue(machineBase);

      await expect(
        machinesService.remove('machine-id-123', 'admin-id', 'admin'),
      ).resolves.toBeUndefined();
    });

    it('should throw AppError 403 when requester is not owner or admin', async () => {
      mockFindById.mockResolvedValue(machineBase);

      await expect(
        machinesService.remove('machine-id-123', 'otro-usuario', 'user'),
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when machine does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        machinesService.remove('no-existe', 'user-id-abc', 'admin'),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

export {};
