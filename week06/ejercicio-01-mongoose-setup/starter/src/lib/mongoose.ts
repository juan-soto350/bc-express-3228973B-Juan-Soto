import mongoose from 'mongoose';

const MONGODB_URI = process.env['MONGODB_URI'];

export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI no está definida en las variables de entorno');
  }

  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}
