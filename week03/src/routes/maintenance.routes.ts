// Capa de Routes: solo mapeo URL -> controller.

import { Router, type Router as ExpressRouter } from 'express';
import { maintenanceController } from '../controllers/maintenance.controller';

const router: ExpressRouter = Router();

router.get('/', maintenanceController.list);
router.get('/:id', maintenanceController.getById);
router.post('/', maintenanceController.create);
router.put('/:id', maintenanceController.update);
router.delete('/:id', maintenanceController.remove);

export { router as maintenanceRouter };
