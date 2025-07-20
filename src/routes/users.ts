import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { updateProfileRateLimit } from '../middlewares/rateLimit';
import { UserController } from '../controllers/userController';
import { createUploader } from '../middlewares/multerUploader';
import { uploadFiles } from '../controllers/fileController';
declare global {
    namespace Express {
        interface Request {
            uploadFolder?: string;
        }
    }
}
const router = Router();
router.get('/profile', authenticateToken, requireRole('admin'), UserController.getProfile);
router.put('/profile', updateProfileRateLimit, authenticateToken, UserController.updateProfile);
router.put('/update-picture', updateProfileRateLimit, authenticateToken, UserController.updatePicture, createUploader(), uploadFiles);

export default router;