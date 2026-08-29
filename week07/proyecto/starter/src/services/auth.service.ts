import bcrypt from 'bcrypt';
import { AppError } from '../errors/AppError';
import * as usersRepository from '../repositories/users.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { RegisterDto, LoginDto } from '../schemas/auth.schema';
import { IUser } from '../models/user.model';

const SALT_ROUNDS = 10;
const COOKIE_ACCESS_MAX_AGE = 15 * 60 * 1000; // 15 minutos
const COOKIE_REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días

export interface TokenCookieOptions {
  accessToken: string;
  refreshToken: string;
  accessMaxAge: number;
  refreshMaxAge: number;
}

export async function register(dto: RegisterDto): Promise<IUser> {
  const existing = await usersRepository.findByEmail(dto.email);
  if (existing) throw new AppError(409, 'El email ya está registrado');

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
  return usersRepository.create({ ...dto, password: hashedPassword });
}

export async function login(dto: LoginDto): Promise<TokenCookieOptions> {
  const user = await usersRepository.findByEmailWithPassword(dto.email);

  // Mismo mensaje para email no encontrado Y contraseña incorrecta
  if (!user) throw new AppError(401, 'Credenciales inválidas');

  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) throw new AppError(401, 'Credenciales inválidas');

  const payload = { sub: user._id.toString(), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user._id.toString() });

  // Almacenar HASH del refresh token
  const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await usersRepository.updateRefreshToken(user._id.toString(), hashedRefresh);

  return {
    accessToken,
    refreshToken,
    accessMaxAge: COOKIE_ACCESS_MAX_AGE,
    refreshMaxAge: COOKIE_REFRESH_MAX_AGE,
  };
}

export async function refresh(incomingToken: string): Promise<TokenCookieOptions> {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(incomingToken) as { sub: string };
  } catch {
    throw new AppError(401, 'Refresh token inválido o expirado');
  }

  const user = await usersRepository.findByIdWithTokens(payload.sub);
  if (!user || !user.refreshToken) {
    throw new AppError(401, 'Sesión no válida');
  }

  const isValid = await bcrypt.compare(incomingToken, user.refreshToken);
  if (!isValid) throw new AppError(401, 'Refresh token no coincide');

  // Rotar: generar nuevos tokens
  const newPayload = { sub: user._id.toString(), email: user.email, role: user.role };
  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken({ sub: user._id.toString() });

  const newHashedRefresh = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);
  await usersRepository.updateRefreshToken(user._id.toString(), newHashedRefresh);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessMaxAge: COOKIE_ACCESS_MAX_AGE,
    refreshMaxAge: COOKIE_REFRESH_MAX_AGE,
  };
}

export async function logout(userId: string): Promise<void> {
  await usersRepository.updateRefreshToken(userId, undefined);
}

export async function getMe(userId: string): Promise<IUser> {
  const user = await usersRepository.findById(userId);
  if (!user) throw new AppError(404, 'Usuario no encontrado');
  return user;
}
