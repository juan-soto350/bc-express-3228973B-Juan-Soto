import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError.js';
import type { LoginDto, RegisterDto, UserDocument } from '../types/index.js';
import * as usersRepo from '../repositories/users.repository.js';
import { signAccessToken } from '../utils/jwt.js';

const BCRYPT_ROUNDS = 12;

// ============================================================
// AUTH SERVICE — lógica de negocio para autenticación
// ============================================================
// Esta capa ES la que se testea en el ejercicio 01.
// Las funciones de usersRepo se mockean con jest.mock().
// ============================================================

/**
 * Registra un nuevo usuario.
 * Lanza AppError 409 si el email ya existe.
 */
export async function register(dto: RegisterDto): Promise<Omit<UserDocument, 'password'>> {
  const existing = await usersRepo.findUserByEmail(dto.email);

  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

  const user = await usersRepo.createUser({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    role: 'user',
  });

  // Omitir la contraseña de la respuesta
  const { password: _pwd, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Autentica un usuario y devuelve un access token.
 * Lanza AppError 401 si las credenciales son inválidas.
 */
export async function login(dto: LoginDto): Promise<{ accessToken: string }> {
  const user = await usersRepo.findUserByEmail(dto.email);

  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(dto.password, user.password);

  if (!passwordMatch) {
    throw new AppError(401, 'Invalid credentials');
  }

  const accessToken = signAccessToken({ sub: user._id, role: user.role });
  return { accessToken };
}
