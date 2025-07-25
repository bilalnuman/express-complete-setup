import express from 'express';
import UserRoleController from '../controllers/UserRoleController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();


// router.get('/index', UserRoleController.index);
// router.get('/show/:id', UserRoleController.show);
router.use(authenticateToken);
router.post('/assign', UserRoleController.create);
router.put('/update/:id', UserRoleController.update);
router.delete('/delte/:id', UserRoleController.delete);

export default router;
