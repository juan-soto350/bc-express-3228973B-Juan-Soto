// Punto de entrada: carga variables de entorno y arranca el servidor.

import 'dotenv/config';
import { createApp } from './app';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const app = createApp();

app.listen(port, () => {
  console.log(`[arcade-api] escuchando en http://localhost:${port}`);
  console.log(`[arcade-api] health:      http://localhost:${port}/health`);
  console.log(`[arcade-api] machines:    http://localhost:${port}/api/v1/machines`);
  console.log(`[arcade-api] tokens:      http://localhost:${port}/api/v1/tokens`);
  console.log(`[arcade-api] players:     http://localhost:${port}/api/v1/players`);
  console.log(`[arcade-api] maintenance: http://localhost:${port}/api/v1/maintenance`);
});
