import express from 'express';
import { playersRouter } from './routes/players.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/players', playersRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
