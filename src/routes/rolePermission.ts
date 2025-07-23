import express from 'express';
import RolePermissionContoller from '../controllers/RolePermissionContoller';

const router = express.Router();

// Define route handlers
// router.get('/index', RolePermissionContoller.index);
// router.get('/show/:id', RolePermissionContoller.show);
router.post('/assign', RolePermissionContoller.create);
router.put('/update/:id', RolePermissionContoller.update);
router.delete('/delte/:id', RolePermissionContoller.delete);

export default router;
  