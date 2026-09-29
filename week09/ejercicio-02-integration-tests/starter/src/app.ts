import express from 'express';
import helmet from 'helmet';
import { authRouter } from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

// ============================================================
// app.ts — configuración de Express SIN app.listen()
// ============================================================
// Los tests importan { app } desde este archivo.
// server.ts es el único que llama app.listen() y NO se importa en tests.
// ============================================================

export const app = express();

// Security middlewares
app.use(helmet());

// Body parsing
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handling (must be last)
app.use(errorHandler);
