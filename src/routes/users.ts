import { Request, Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { UserController } from '../controllers/userController';
import { createUploader } from '../middlewares/multerUploader';
import { updateProfileRateLimit } from '../controllers/rateLimit';
import { uploadFiles } from '../controllers/fileController';
declare global {
    namespace Express {
        interface Request {
            uploadFolder?: string;
        }
    }
}
const router = Router();
router.use(authenticateToken)

router.get('/', UserController.index);
router.get('/profile', UserController.getProfile);
router.put('/profile', updateProfileRateLimit, UserController.updateProfile);
router.put('/update-picture', createUploader(), UserController.updatePicture);

export default router;