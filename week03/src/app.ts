// Configuración de la aplicación Express.
// No escucha puertos; eso lo hace server.ts para poder testear app aisladamente.

import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { machinesRouter } from './routes/machines.routes';
import { maintenanceRouter } from './routes/maintenance.routes';
import { playersRouter } from './routes/players.routes';
import { tokensRouter } from './routes/tokens.routes';
import { ErrorResponse } from './types';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/v1/machines', machinesRouter);
  app.use('/api/v1/tokens', tokensRouter);
  app.use('/api/v1/players', playersRouter);
  app.use('/api/v1/maintenance', maintenanceRouter);

  // 404 para rutas no encontradas
  app.use((req: Request, res: Response) => {
    const body: ErrorResponse = {
      error: 'Not Found',
      message: `Ruta ${req.method} ${req.originalUrl} no existe`,
    };
    res.status(404).json(body);
  });

  // Manejador global de errores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    const body: ErrorResponse = {
      error: 'Internal Server Error',
      message: err.message || 'Error inesperado',
    };
    res.status(500).json(body);
  });

  return app;
}
