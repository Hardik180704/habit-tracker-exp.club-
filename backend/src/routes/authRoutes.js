import express from 'express';
import { register, login, getMe, deleteAccount } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, getMe);
router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;
