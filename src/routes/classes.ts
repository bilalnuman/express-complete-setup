import express from 'express';
import ClassController from '../controllers/ClassController';

const router = express.Router();

// Define route handlers
router.get('/', ClassController.index);
router.get('/:id', ClassController.show);
router.post('/', ClassController.create);
router.put('/:id', ClassController.update);
router.delete('/:id', ClassController.delete);

export default router;
