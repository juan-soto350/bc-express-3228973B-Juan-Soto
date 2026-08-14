// src/routes/tokens.routes.ts — Definición de rutas

import { Router } from 'express';
import * as ctrl from '../controllers/tokens.controller';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
