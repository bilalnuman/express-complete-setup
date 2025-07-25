import express from 'express';
import StudentDocumentsController from '../controllers/StudentDocumentsController';

const router = express.Router();

// Define route handlers
router.get('/index', StudentDocumentsController.index);
router.get('/show/:id', StudentDocumentsController.show);
router.post('/create', StudentDocumentsController.create);
router.put('/update/:id', StudentDocumentsController.update);
router.delete('/delte/:id', StudentDocumentsController.delete);

export default router;
  