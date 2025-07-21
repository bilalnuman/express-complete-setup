import { Request, Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { uploadFiles } from '../controllers/fileController';
import { createUploader } from '../middlewares/multerUploader';
declare global {
    namespace Express {
        interface Request {
            uploadFolder?: string;
        }
    }
}
const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Private routes
router.get('/profile', authenticateToken, requireRole('admin'), AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
// router.put('/profile', authenticateToken, AuthController.updateProfile,createUploader(), uploadFiles);
router.put('/change-password', authenticateToken, AuthController.changePassword);
router.post('/upload', (req: Request, res: Express.Response, next: Function) => {
    req.uploadFolder = 'uploads';
    next();
}, createUploader(), uploadFiles);

export default router;