import express from 'express';
import RoleController from '../controllers/RoleController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/index', RoleController.index);
router.get('/show/:id', RoleController.show);
router.post('/create', RoleController.create);
router.put('/update/:id', RoleController.update);
router.delete('/delte/:id', RoleController.delete);

export default router;
