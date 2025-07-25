import express from 'express';
import PermissionController from '../controllers/PermissionController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();
router.use(authenticateToken);

router.get('/index', PermissionController.index);
router.get('/show/:id', PermissionController.show);
router.post('/create', PermissionController.create);
router.put('/update/:id', PermissionController.update);
router.delete('/delte/:id', PermissionController.delete);

export default router;
