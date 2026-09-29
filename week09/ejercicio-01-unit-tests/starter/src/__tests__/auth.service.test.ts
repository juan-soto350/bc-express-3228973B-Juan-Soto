// ============================================================
// UNIT TESTS — auth.service.ts
// ============================================================
// Objetivo: testear auth.service en aislamiento total.
// La capa de repositorio se MOCKEA — nunca toca una DB real.
//
// Patrón:
//   Arrange → configurar mocks y datos de prueba
//   Act     → llamar la función que se testea
//   Assert  → verificar el resultado o el error
// ============================================================

import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError';

jest.mock('../repositories/users.repository');

import * as usersRepo from '../repositories/users.repository';
import * as authService from '../services/auth.service';

// Castear las funciones a MockedFunction para poder usar mockResolvedValue
const mockFindByEmail = usersRepo.findUserByEmail as jest.MockedFunction<
  typeof usersRepo.findUserByEmail
>;
const mockCreateUser = usersRepo.createUser as jest.MockedFunction<
  typeof usersRepo.createUser
>;

// ============================================================
// Datos base reutilizables entre tests
// ============================================================
const userBase = {
  _id: 'user-id-abc123',
  name: 'Alice',
  email: 'alice@test.com',
  password: 'hashed-password',
  role: 'user' as const,
  createdAt: new Date('2025-01-01'),
};

const registerDto = {
  name: 'Alice',
  email: 'alice@test.com',
  password: 'Password1!',
};

const loginDto = {
  email: 'alice@test.com',
  password: 'Password1!',
};

describe('Auth Service — Unit Tests', () => {
  it('should have mocked repository functions', () => {
    expect(jest.isMockFunction(usersRepo.findUserByEmail)).toBe(true);
    expect(jest.isMockFunction(usersRepo.createUser)).toBe(true);
  });

  // ============================================================
  // register()
  // ============================================================
  describe('register()', () => {
    it('should create a user and return it without the password', async () => {
      // ARRANGE — el email no existe aún en la DB
      mockFindByEmail.mockResolvedValue(null);

      // La DB devuelve el usuario creado (con contraseña hasheada)
      const hashedPwd = await bcrypt.hash(registerDto.password, 1);
      mockCreateUser.mockResolvedValue({
        ...userBase,
        password: hashedPwd,
      });

      // ACT
      const result = await authService.register(registerDto);

      // ASSERT
      expect(result.email).toBe(registerDto.email);
      expect(result.name).toBe(registerDto.name);
      expect(result.role).toBe('user');
      // La contraseña NUNCA debe estar en el resultado
      expect((result as Record<string, unknown>).password).toBeUndefined();
    });

    it('should hash the password before creating the user', async () => {
      // ARRANGE
      mockFindByEmail.mockResolvedValue(null);
      mockCreateUser.mockResolvedValue({ ...userBase });

      // ACT
      await authService.register(registerDto);

      // ASSERT — la contraseña pasada al repositorio NO es la del DTO en claro
      const createArg = mockCreateUser.mock.calls[0][0];
      expect(createArg.password).not.toBe(registerDto.password);
      expect(createArg.password).toMatch(/^\$2[aby]\$/); // hash bcrypt
      expect(createArg.role).toBe('user');
    });

    it('should throw AppError 409 if email already exists', async () => {
      // ARRANGE — el email YA existe en la DB
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: 'hashed-password',
      });

      // ACT + ASSERT
      await expect(authService.register(registerDto)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Email already registered',
      });

      // createUser NUNCA debe haber sido llamado
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should throw an AppError instance on duplicate email', async () => {
      // ARRANGE
      mockFindByEmail.mockResolvedValue({ ...userBase });

      // ACT + ASSERT
      await expect(authService.register(registerDto)).rejects.toBeInstanceOf(AppError);
    });
  });

  // ============================================================
  // login()
  // ============================================================
  describe('login()', () => {
    it('should throw AppError 401 when user is not found', async () => {
      // ARRANGE — email no existe en la DB
      mockFindByEmail.mockResolvedValue(null);

      // ACT + ASSERT
      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should throw AppError 401 when password is wrong', async () => {
      // ARRANGE — el usuario existe pero la contraseña es distinta
      // Usamos bcrypt.hash con rounds=1 para que sea rápido en tests
      const realHash = await bcrypt.hash('OtraContrasena1!', 1);
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: realHash, // contraseña diferente a loginDto.password
      });

      // ACT + ASSERT
      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should return accessToken on valid credentials', async () => {
      // ARRANGE — hashear la contraseña CORRECTA (la misma que loginDto.password)
      const correctHash = await bcrypt.hash(loginDto.password, 1);
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: correctHash,
      });

      // ACT
      const result = await authService.login(loginDto);

      // ASSERT
      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
    });

    it('should call findByEmail with the correct email', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toBeDefined();

      // Verificar que el repositorio recibió el email correcto
      expect(mockFindByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockFindByEmail).toHaveBeenCalledTimes(1);
    });
  });
});

// Este export vacío es necesario para que TypeScript
// trate el archivo como un módulo (evita errores de scope global)
export {};
