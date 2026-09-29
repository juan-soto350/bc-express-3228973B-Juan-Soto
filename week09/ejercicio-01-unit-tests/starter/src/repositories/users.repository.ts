import type { UserDocument } from '../types/index.js';

// ============================================================
// REPOSITORIO DE USUARIOS — capa de acceso a datos
// ============================================================
// En los tests unitarios, ESTE módulo completo se mockea con
// jest.mock('../repositories/users.repository')
// y estas funciones se reemplazan con jest.fn()
// ============================================================

/**
 * Busca un usuario por email.
 * Devuelve null si no existe.
 */
export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  // Implementación real usaría un modelo Mongoose aquí
  // (no disponible en este ejercicio — solo para Unit Tests)
  void email;
  return null;
}

/**
 * Crea un nuevo usuario en la base de datos.
 */
export async function createUser(
  data: Pick<UserDocument, 'name' | 'email' | 'password' | 'role'>,
): Promise<UserDocument> {
  // Implementación real usaría un modelo Mongoose aquí
  void data;
  throw new Error('Not implemented — use jest.mock() in tests');
}

/**
 * Busca un usuario por ID.
 */
export async function findUserById(id: string): Promise<UserDocument | null> {
  void id;
  return null;
}
