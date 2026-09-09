import { Router } from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Student Application Routes
router.post('/applications', authenticateUser, requireRole('STUDENT'), applicationController.submitApplication);
router.get('/applications/my', authenticateUser, requireRole('STUDENT'), applicationController.getMyApplications);
router.get('/applications/:applicationId', authenticateUser, applicationController.getApplicationById);

// Teacher Application Review Routes
router.get('/teachers/applications', authenticateUser, requireRole('TEACHER', 'ADMIN'), applicationController.getTeacherApplications);
router.get('/teachers/applications/:applicationId', authenticateUser, requireRole('TEACHER', 'ADMIN'), applicationController.getTeacherApplicationById);
router.patch('/applications/:applicationId/status', authenticateUser, requireRole('TEACHER', 'ADMIN'), applicationController.updateApplicationStatus);

export default router;
