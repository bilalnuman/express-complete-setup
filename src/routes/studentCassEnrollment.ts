import express from 'express';
import StudentCassEnrollmentController from '../controllers/StudentCassEnrollmentController';

const router = express.Router();

// Define route handlers
router.get('/index', StudentCassEnrollmentController.index);
router.get('/show/:id', StudentCassEnrollmentController.show);
router.post('/create', StudentCassEnrollmentController.create);
router.put('/update/:id', StudentCassEnrollmentController.update);
router.delete('/delte/:id', StudentCassEnrollmentController.delete);

export default router;
  