import { Router } from 'express';
import * as applicationController from '../controllers/applicationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateUser(req, res, next);
  }
  next();
};

// Student Application Routes
router.post(['/applications', '/application'], optionalAuth, applicationController.submitApplication);
router.get(['/applications/my', '/my/applications', '/applications/me'], optionalAuth, applicationController.getMyApplications);
router.get(['/applications/student/:studentId', '/students/:studentId/applications', '/student/:studentId/applications'], optionalAuth, applicationController.getMyApplications);
router.get(['/applications/club/:clubId', '/clubs/:clubId/applications', '/club/:clubId/applications'], optionalAuth, applicationController.getClubApplications);
router.get('/applications/:applicationId', optionalAuth, applicationController.getApplicationById);

// Teacher & President Review Routes
router.get(['/teachers/applications', '/teacher/applications', '/applications/teacher', '/applications/teachers'], optionalAuth, applicationController.getTeacherApplications);
router.get(['/applications/teacher/:teacherId', '/teachers/:teacherId/applications', '/teacher/:teacherId/applications'], optionalAuth, applicationController.getTeacherApplications);
router.get(['/teachers/applications/:applicationId', '/applications/review/:applicationId'], optionalAuth, applicationController.getTeacherApplicationById);
router.patch('/applications/:applicationId/status', optionalAuth, applicationController.updateApplicationStatus);
router.put(['/applications/:applicationId/review', '/applications/:applicationId/status'], optionalAuth, applicationController.updateApplicationStatus);

export default router;

