import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import machinesRouter from './routes/machines.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Rutas de máquinas arcade (protegidas con authMiddleware en el router)
app.use('/api/v1/machines', machinesRouter);

// Middlewares de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
