import express from 'express'
import type {Application, Request, Response, NextFunction} from 'express';
import {machineRouter} from './routes/machines.routes.js';

export function createApp(): Application {
	const app = express();
	
	// TODO: Registrar middleware en este orden exacto:
	// 1. express.json() — parseo de body (requerido para POST/PUT)
	app.use(express.json());	// 2. Logger personalizado — loggear todas las peticiones
	app.use((req, res, next) => {
		const startTime = Date.now();
		res.on('finish', () => {
			const ms = Date.now() - startTime;
			console.log(`[${req.method}] ${req.url} ${res.statusCode} - ${ms}ms`);
		});
		next();
	});

	// 3. Health check (no requiere middleware especial)
	app.get('/health', (_req,res) => {
		res.json( {status: 'Ok'});

	});

	// 4. Rutas del recurso principal
	app.use('/api/v1/machines', machineRouter);
	// 5. Handler para rutas no encontradas (404)
	app.use((_req, res) => {
		res.status(404).json({ error: 'Route not found' });
	});

	// 6. Error handler global — SIEMPRE el último app.use()
	app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
		console.error(err.message);
		res.status(500).json({ err: 'Error interno del server' });
	});
	
	return app;
}
