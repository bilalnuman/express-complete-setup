import express from 'express';
import StudentController from '../controllers/StudentController';

const router = express.Router();

// Define route handlers
router.get('/', StudentController.index);
router.get('/:id', StudentController.show);
router.post('/create', StudentController.create);
router.put('/:id', StudentController.update);
router.delete('/:id', StudentController.delete);

export default router;
