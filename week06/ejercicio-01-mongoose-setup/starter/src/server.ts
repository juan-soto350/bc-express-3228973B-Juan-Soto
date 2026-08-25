// ============================================
// PASO 2: Conectar a MongoDB antes de iniciar el servidor
// ============================================
//
// Mongoose mantiene un estado de conexión global.
// Debemos llamar connectDB() ANTES de app.listen()
// para garantizar que las queries funcionen desde el inicio.
//
// Descomenta las líneas marcadas como PASO 2:

import 'dotenv/config';
import { app } from './app';
// import { connectDB } from './lib/mongoose';   // PASO 2: importar connectDB

const PORT = process.env['PORT'] ?? '3000';

async function main(): Promise<void> {
  // PASO 2 — conectar a MongoDB antes de escuchar:
  // await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
