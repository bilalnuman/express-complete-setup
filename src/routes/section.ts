import express from 'express';
import SectionController from '../controllers/SectionController';

const router = express.Router();

// Define route handlers
router.get('/index', SectionController.index);
router.get('/show/:id', SectionController.show);
router.post('/create', SectionController.create);
router.put('/update/:id', SectionController.update);
router.delete('/delte/:id', SectionController.delete);

export default router;
  