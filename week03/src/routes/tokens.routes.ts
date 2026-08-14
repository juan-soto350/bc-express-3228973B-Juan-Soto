// Capa de Routes: solo mapeo URL -> controller.

import { Router, type Router as ExpressRouter } from 'express';
import { tokensController } from '../controllers/tokens.controller';

const router: ExpressRouter = Router();

router.get('/', tokensController.list);
router.get('/:id', tokensController.getById);
router.post('/', tokensController.create);
router.put('/:id', tokensController.update);
router.delete('/:id', tokensController.remove);

export { router as tokensRouter };
