import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from '../controllers/machines.controller.js';

// ============================================================
// MACHINES ROUTER — dominio: Sala de videojuegos / Arcade
// ============================================================
// Ruta base: /api/v1/machines
// DELETE requiere rol admin (requireRole/authorize)
// ============================================================

export const machinesRouter = Router();

machinesRouter.get('/',     getAllHandler);
machinesRouter.get('/:id',  getByIdHandler);
machinesRouter.post('/',    authenticate, createHandler);
machinesRouter.put('/:id',  authenticate, updateHandler);
machinesRouter.delete('/:id', authenticate, authorize('admin'), deleteHandler);
