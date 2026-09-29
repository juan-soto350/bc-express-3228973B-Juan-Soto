import { UserModel } from '../models/user.model.js';
import type { IUser } from '../models/user.model.js';

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return UserModel.findOne({ email }).lean<IUser>().exec();
}

export async function createUser(
  data: Pick<IUser, 'name' | 'email' | 'password' | 'role'>,
): Promise<IUser> {
  const user = new UserModel(data);
  const saved = await user.save();
  // Devolver objeto plano (no Document) para que el spread del servicio
  // elimine la contraseña correctamente
  return saved.toObject() as unknown as IUser;
}

export async function findUserById(id: string): Promise<IUser | null> {
  return UserModel.findById(id).lean<IUser>().exec();
}
