import { Router } from 'express';
import * as machinesController from '../controllers/machines.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/v1/machines — listar todas
router.get('/', machinesController.getAll);

// GET /api/v1/machines/:id — obtener una por ID
router.get('/:id', machinesController.getById);

// POST /api/v1/machines — crear una nueva
router.post('/', machinesController.create);

// PATCH /api/v1/machines/:id — actualizar parcialmente
router.patch('/:id', machinesController.update);

// DELETE /api/v1/machines/:id — eliminar
router.delete('/:id', machinesController.remove);

export default router;
