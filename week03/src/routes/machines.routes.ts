// Capa de Routes: solo mapeo URL -> controller.

import { Router, type Router as ExpressRouter } from 'express';
import { machinesController } from '../controllers/machines.controller';

const router: ExpressRouter = Router();

router.get('/', machinesController.list);
router.get('/:id', machinesController.getById);
router.post('/', machinesController.create);
router.put('/:id', machinesController.update);
router.delete('/:id', machinesController.remove);

export { router as machinesRouter };
