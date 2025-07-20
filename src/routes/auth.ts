import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
import { PasswordController } from '../controllers/passwordController';
import { strictRateLimit } from '../middlewares/rateLimit';
declare global {
    namespace Express {
        interface Request {
            uploadFolder?: string;
        }
    }
}
const router = Router();


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post("/forgot-password", strictRateLimit, PasswordController.takeEmail)
router.put('/change-password', authenticateToken, strictRateLimit, PasswordController.changePassword);

export default router;