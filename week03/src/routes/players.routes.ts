// Capa de Routes: solo mapeo URL -> controller.

import { Router, type Router as ExpressRouter } from 'express';
import { playersController } from '../controllers/players.controller';

const router: ExpressRouter = Router();

router.get('/', playersController.list);
router.get('/:id', playersController.getById);
router.post('/', playersController.create);
router.put('/:id', playersController.update);
router.delete('/:id', playersController.remove);

export { router as playersRouter };
