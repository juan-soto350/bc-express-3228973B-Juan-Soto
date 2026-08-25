// ============================================
// PASO 5: Seed — Insertar datos de prueba en MongoDB
// ============================================
//
// El seed limpia la colección e inserta jugadores de ejemplo.
// Ejecutar con: pnpm seed
//
// Descomenta las siguientes líneas (PASO 5):

import 'dotenv/config';
// import { connectDB, disconnectDB } from './lib/mongoose';
// import { Player } from './models/player.model';

// async function seed(): Promise<void> {
//   await connectDB();
//
//   // Limpiar colección existente
//   await Player.deleteMany({});
//   console.log('Collection cleared');
//
//   // Insertar jugadores de ejemplo
//   await Player.insertMany([
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
//     {
//       alias: 'luisam',
//       nombre: 'Luisa Martinez',
//       edad: 17,
//       nivel: 'intermedio',
//     },
//     {
//       alias: 'juans',
//       nombre: 'Juan Soto',
//       edad: 28,
//       nivel: 'avanzado',
//     },
//   ]);
//
//   console.log('Seed completed: 5 players inserted');
//   await disconnectDB();
// }
//
// seed().catch((err: unknown) => {
//   console.error('Seed failed:', err);
//   process.exit(1);
// });
