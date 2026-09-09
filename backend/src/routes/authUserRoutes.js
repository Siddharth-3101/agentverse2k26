import { Router } from 'express';
import * as authUserController from '../controllers/authUserController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateUser(req, res, next);
  }
  next();
};

// Public auth routes (supports both /auth/login and /login)
router.post(['/auth/login', '/login'], authUserController.login);
router.post(['/auth/register', '/register'], authUserController.register);
router.post(['/auth/logout', '/logout'], authUserController.logout);

// User routes
router.get('/users', optionalAuth, authUserController.getUsers);
router.get(['/auth/me', '/me'], optionalAuth, authUserController.getMe);
router.get('/users/profile', optionalAuth, authUserController.getProfile);
router.put('/users/profile', optionalAuth, authUserController.updateProfile);


// Student profile routes
router.get('/students/:studentId', optionalAuth, authUserController.getStudent);
router.put('/students/:studentId', optionalAuth, authUserController.updateStudent);

// Teacher profile routes
router.get('/teachers/:teacherId', optionalAuth, authUserController.getTeacher);
router.put('/teachers/:teacherId', optionalAuth, authUserController.updateTeacher);

export default router;
