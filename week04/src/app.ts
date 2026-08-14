// ============================================
// APP — configuración de Express (orden correcto de middlewares)
// ============================================
import express from 'express';
import { morganMiddleware } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import machinesRouter from './routes/machines.routes';
import maintenanceRouter from './routes/maintenance.routes';
import playersRouter from './routes/players.routes';
import tokensRouter from './routes/tokens.routes';

const app = express();

// 1. Middlewares generales
app.use(express.json());
app.use(morganMiddleware);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 2. Rutas del dominio
app.use('/api/v1/machines', machinesRouter);
app.use('/api/v1/tokens', tokensRouter);
app.use('/api/v1/players', playersRouter);
app.use('/api/v1/maintenance', maintenanceRouter);

// 3. 404 para rutas no encontradas (después de todas las rutas)
app.use(notFound);

// 4. Error handler global — SIEMPRE el último
app.use(errorHandler);

export default app;
