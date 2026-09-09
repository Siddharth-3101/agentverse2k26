import { Router } from 'express';
import * as authUserController from '../controllers/authUserController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Public auth routes
router.post('/auth/login', authUserController.login);
router.post('/auth/logout', authUserController.logout);

// Protected user routes
router.get('/auth/me', authenticateUser, authUserController.getMe);
router.get('/users/profile', authenticateUser, authUserController.getProfile);
router.put('/users/profile', authenticateUser, authUserController.updateProfile);

// Student profile routes
router.get('/students/:studentId', authenticateUser, authUserController.getStudent);
router.put('/students/:studentId', authenticateUser, authUserController.updateStudent);

// Teacher profile routes
router.get('/teachers/:teacherId', authenticateUser, authUserController.getTeacher);
router.put('/teachers/:teacherId', authenticateUser, authUserController.updateTeacher);

export default router;
