import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post('/login', validate('login'), authController.login);
router.post('/register', validate('register'), authController.register);
router.post('/login-with-backup', authController.loginWithBackup);
router.get('/profile', authenticate, authController.getProfile);
router.post('/change-password', authenticate, authController.changePassword);

export default router;
