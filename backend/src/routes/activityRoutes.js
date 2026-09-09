import { Router } from 'express';
import * as activityController from '../controllers/activityController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// General Activity Routes
router.get('/activities', activityController.getActivities);
router.get('/activities/:activityId', activityController.getActivityById);
router.post('/activities', authenticateUser, requireRole('TEACHER', 'ADMIN'), activityController.createActivity);
router.put('/activities/:activityId', authenticateUser, requireRole('TEACHER', 'ADMIN'), activityController.updateActivity);
router.delete('/activities/:activityId', authenticateUser, requireRole('TEACHER', 'ADMIN'), activityController.deleteActivity);

// Student & Club Activities
router.get('/students/:studentId/activities', authenticateUser, activityController.getStudentActivities);
router.post('/students/:studentId/activities', authenticateUser, activityController.registerForActivity);
router.get('/clubs/:clubId/activities', activityController.getClubActivities);

// Certificates
router.get('/certificates', authenticateUser, activityController.getCertificates);
router.post('/certificates', authenticateUser, activityController.addCertificate);

export default router;
