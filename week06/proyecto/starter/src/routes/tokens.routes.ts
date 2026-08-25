import { Router } from 'express';
import * as tokensController from '../controllers/tokens.controller';

const router = Router();

router.get('/', tokensController.getAll);
router.get('/:id', tokensController.getById);
router.post('/', tokensController.create);
router.put('/:id', tokensController.update);
router.delete('/:id', tokensController.remove);

export { router as tokensRouter };
