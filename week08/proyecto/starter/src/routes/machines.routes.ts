import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/machines.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// GET /api/v1/machines — público (catálogo visible para todos)
router.get('/', getAll);

// GET /api/v1/machines/:id — público
router.get('/:id', getById);

// POST /api/v1/machines — autenticado (cualquier usuario autenticado puede crear)
router.post('/', authMiddleware, create);

// PATCH /api/v1/machines/:id — autenticado (el service verifica dueño o admin)
router.patch('/:id', authMiddleware, update);

// DELETE /api/v1/machines/:id — solo admin
router.delete('/:id', authMiddleware, requireRole('admin'), remove);

export default router;
