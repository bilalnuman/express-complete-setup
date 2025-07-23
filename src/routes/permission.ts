import express from 'express';
import PermissionController from '../controllers/PermissionController';

const router = express.Router();

router.get('/index', PermissionController.index);
router.get('/show/:id', PermissionController.show);
router.post('/assign', PermissionController.create);
router.put('/update/:id', PermissionController.update);
router.delete('/delte/:id', PermissionController.delete);

export default router;
