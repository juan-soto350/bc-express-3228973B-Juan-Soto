// ============================================
// PASO 3: Seed — Insertar players primero, luego tokens
// ============================================
//
// El orden importa: los tokens referencian players por ObjectId.
// Si insertas tokens sin players existentes, el ObjectId apuntará a documentos inexistentes.
//
// Descomenta las siguientes líneas (PASO 3):

import 'dotenv/config';
// import { connectDB, disconnectDB } from './lib/mongoose';
// import { Player } from './models/player.model';
// import { Token } from './models/token.model';

// async function seed(): Promise<void> {
//   await connectDB();
//
//   // Limpiar ambas colecciones
//   await Token.deleteMany({});
//   await Player.deleteMany({});
//   console.log('Collections cleared');
//
//   // Insertar jugadores y obtener sus IDs
//   const [carlos, maria, pedro] = await Player.insertMany([
//     {
//       alias: 'carlosr',
//       nombre: 'Carlos Ramirez',
//       edad: 22,
//       nivel: 'intermedio',
//     },
//     {
//       alias: 'mariag',
//       nombre: 'Maria Garcia',
//       edad: 19,
//       nivel: 'principiante',
//     },
//     {
//       alias: 'pedrop',
//       nombre: 'Pedro Perez',
//       edad: 25,
//       nivel: 'avanzado',
//     },
//   ]);
//
//   // Usar los IDs al crear tokens
//   await Token.insertMany([
//     { codigo: 'TKN-0001', cantidad: 10, estado: 'activo', player: carlos._id },
//     { codigo: 'TKN-0002', cantidad: 5, estado: 'activo', player: maria._id },
//     { codigo: 'TKN-0003', cantidad: 20, estado: 'consumido', player: pedro._id },
//     { codigo: 'TKN-0004', cantidad: 8, estado: 'activo', player: carlos._id },
//     { codigo: 'TKN-0005', cantidad: 3, estado: 'expirado', player: maria._id },
//   ]);
//
//   console.log('Seed completed: 3 players, 5 tokens inserted');
//   await disconnectDB();
// }
//
// seed().catch((err: unknown) => {
//   console.error('Seed failed:', err);
//   process.exit(1);
// });
