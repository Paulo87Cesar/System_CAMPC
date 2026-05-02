import { Router } from 'express';
import { JovemController } from '../controllers/jovem.controller';

const router = Router();

router.get('/', JovemController.getAll);
router.get('/:id', JovemController.getById);
router.post('/', JovemController.create);
router.put('/:id', JovemController.update);
router.delete('/:id', JovemController.delete);

export default router;
