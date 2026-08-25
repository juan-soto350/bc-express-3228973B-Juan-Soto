import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Player } from './models/player.model';
import { Token } from './models/token.model';

async function seed(): Promise<void> {
  await connectDB();

  // Limpiar ambas colecciones
  await Token.deleteMany({});
  await Player.deleteMany({});
  console.log('Collections cleared');

  // Insertar jugadores y obtener sus IDs
  const [carlos, maria, pedro, luisa, juan] = await Player.insertMany([
    {
      alias: 'carlosr',
      nombre: 'Carlos Ramirez',
      edad: 22,
      nivel: 'intermedio',
    },
    {
      alias: 'mariag',
      nombre: 'Maria Garcia',
      edad: 19,
      nivel: 'principiante',
    },
    {
      alias: 'pedrop',
      nombre: 'Pedro Perez',
      edad: 25,
      nivel: 'avanzado',
    },
    {
      alias: 'luisam',
      nombre: 'Luisa Martinez',
      edad: 17,
      nivel: 'intermedio',
    },
    {
      alias: 'juans',
      nombre: 'Juan Soto',
      edad: 28,
      nivel: 'avanzado',
    },
  ]);

  // Usar los IDs al crear tokens
  await Token.insertMany([
    { codigo: 'TKN-0001', cantidad: 10, estado: 'activo', player: carlos._id },
    { codigo: 'TKN-0002', cantidad: 5, estado: 'activo', player: maria._id },
    { codigo: 'TKN-0003', cantidad: 20, estado: 'consumido', player: pedro._id },
    { codigo: 'TKN-0004', cantidad: 8, estado: 'activo', player: carlos._id },
    { codigo: 'TKN-0005', cantidad: 3, estado: 'expirado', player: maria._id },
    { codigo: 'TKN-0006', cantidad: 15, estado: 'activo', player: luisa._id },
    { codigo: 'TKN-0007', cantidad: 12, estado: 'activo', player: juan._id },
    { codigo: 'TKN-0008', cantidad: 7, estado: 'consumido', player: pedro._id },
  ]);

  console.log('Seed completed: 5 players, 8 tokens inserted');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
