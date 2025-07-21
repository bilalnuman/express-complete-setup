import { Request, Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
<<<<<<< Updated upstream
import { requireRole } from '../middlewares/requireRole';
import { uploadFiles } from '../controllers/fileController';
import { createUploader } from '../middlewares/multerUploader';
=======
import { PasswordController } from '../controllers/passwordController';
import { strictRateLimit } from '../middlewares/rateLimit';
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

// Private routes
router.get('/profile', authenticateToken, requireRole('admin'), AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
// router.put('/profile', authenticateToken, AuthController.updateProfile,createUploader(), uploadFiles);
router.put('/change-password', authenticateToken, AuthController.changePassword);
// router.post('/upload', (req: Request, res: Express.Response, next: Function) => {
//     req.uploadFolder = 'uploads';
//     next();
// }, createUploader(), uploadFiles);
=======
router.post("/forgot-password", strictRateLimit, PasswordController.takeEmail)
router.put('/change-password', authenticateToken, strictRateLimit, PasswordController.changePassword);
>>>>>>> Stashed changes

export default router;