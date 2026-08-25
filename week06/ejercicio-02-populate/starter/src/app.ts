// ============================================
// PASO 5: Registrar el router de tokens en app.ts
// ============================================

import express from 'express';
import { playersRouter } from './routes/players.routes';
// import { tokensRouter } from './routes/tokens.routes';  // PASO 5: importar router de tokens
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/players', playersRouter);
// app.use('/api/v1/tokens', tokensRouter);  // PASO 5: montar router de tokens

app.use(notFound);
app.use(errorHandler);

export { app };
