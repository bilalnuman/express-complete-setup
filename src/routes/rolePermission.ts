import express from 'express';
import RolePermissionContoller from '../controllers/RolePermissionContoller';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// Define route handlers
// router.get('/index', RolePermissionContoller.index);
// router.get('/show/:id', RolePermissionContoller.show);
router.use(authenticateToken);
router.post('/create', RolePermissionContoller.create);
router.put('/update/:id', RolePermissionContoller.update);
router.delete('/delte/:id', RolePermissionContoller.delete);

export default router;
