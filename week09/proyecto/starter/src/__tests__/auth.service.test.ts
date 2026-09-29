// ============================================================
// UNIT TESTS — auth.service.ts (con repositorio mockeado)
// ============================================================
// Reutiliza el enfoque del ejercicio 01, adaptado al servicio
// de auth del proyecto (incluye getMe).
// ============================================================

import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError';

jest.mock('../repositories/users.repository');

import * as usersRepo from '../repositories/users.repository';
import * as authService from '../services/auth.service';

const mockFindByEmail = usersRepo.findUserByEmail as jest.MockedFunction<typeof usersRepo.findUserByEmail>;
const mockCreateUser  = usersRepo.createUser      as jest.MockedFunction<typeof usersRepo.createUser>;
const mockFindById    = usersRepo.findUserById    as jest.MockedFunction<typeof usersRepo.findUserById>;

const userBase = {
  _id: 'user-id-abc123',
  name: 'Juan',
  email: 'juan@arcade.com',
  password: 'hashed-password',
  role: 'user' as const,
  createdAt: new Date('2025-01-01'),
};

const registerDto = { name: 'Juan', email: 'juan@arcade.com', password: 'Password1!' };
const loginDto    = { email: 'juan@arcade.com', password: 'Password1!' };

describe('AuthService — Unit Tests (proyecto Arcade)', () => {
  it('should have mocked repository functions', () => {
    expect(jest.isMockFunction(usersRepo.findUserByEmail)).toBe(true);
    expect(jest.isMockFunction(usersRepo.createUser)).toBe(true);
  });

  // ============================================================
  // register()
  // ============================================================
  describe('register()', () => {
    it('should create a user and return it without the password', async () => {
      // ARRANGE
      mockFindByEmail.mockResolvedValue(null);
      const hashedPwd = await bcrypt.hash(registerDto.password, 1);
      mockCreateUser.mockResolvedValue({ ...userBase, password: hashedPwd });

      // ACT
      const result = await authService.register(registerDto);

      // ASSERT
      expect(result.email).toBe(registerDto.email);
      expect(result.role).toBe('user');
      expect((result as Record<string, unknown>).password).toBeUndefined();
    });

    it('should throw AppError 409 if email already exists', async () => {
      mockFindByEmail.mockResolvedValue({ ...userBase });

      await expect(authService.register(registerDto)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Email already registered',
      });
      expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('should throw an AppError instance on duplicate email', async () => {
      mockFindByEmail.mockResolvedValue({ ...userBase });

      await expect(authService.register(registerDto)).rejects.toBeInstanceOf(AppError);
    });
  });

  // ============================================================
  // login()
  // ============================================================
  describe('login()', () => {
    it('should throw AppError 401 when user is not found', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should throw AppError 401 when password is wrong', async () => {
      const realHash = await bcrypt.hash('OtraContrasena1!', 1);
      mockFindByEmail.mockResolvedValue({ ...userBase, password: realHash });

      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should return accessToken on valid credentials', async () => {
      const correctHash = await bcrypt.hash(loginDto.password, 1);
      mockFindByEmail.mockResolvedValue({ ...userBase, password: correctHash });

      const result = await authService.login(loginDto);

      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
    });
  });

  // ============================================================
  // getMe()
  // ============================================================
  describe('getMe()', () => {
    it('should return the user without password', async () => {
      mockFindById.mockResolvedValue({ ...userBase });

      const result = await authService.getMe('user-id-abc123');

      expect(result.email).toBe(userBase.email);
      expect((result as Record<string, unknown>).password).toBeUndefined();
    });

    it('should throw AppError 404 when user does not exist', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(authService.getMe('no-existe')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});

export {};
