// src/app.ts — Configuración de la aplicación Express

import express from 'express';
import { morganMiddleware } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import machinesRouter from './routes/machines.routes';
import maintenanceRouter from './routes/maintenance.routes';
import playersRouter from './routes/players.routes';
import tokensRouter from './routes/tokens.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/machines', machinesRouter);
app.use('/api/v1/maintenance', maintenanceRouter);
app.use('/api/v1/players', playersRouter);
app.use('/api/v1/tokens', tokensRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
