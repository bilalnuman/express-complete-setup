import express from 'express';
import RoleController from '../controllers/RoleController';

const router = express.Router();

router.get('/index', RoleController.index);
router.get('/show/:id', RoleController.show);
router.post('/assign', RoleController.create);
router.put('/update/:id', RoleController.update);
router.delete('/delte/:id', RoleController.delete);

export default router;
