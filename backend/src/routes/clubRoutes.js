import { Router } from 'express';
import * as clubController from '../controllers/clubController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateUser(req, res, next);
  }
  next();
};

// Public / Authenticated view routes
router.get(['/clubs', '/club'], clubController.getClubs);
router.get(['/clubs/:clubId', '/club/:clubId'], clubController.getClubById);
router.get(['/clubs/:clubId/members', '/club/:clubId/members'], clubController.getClubMembers);
router.get(['/clubs/:clubId/mentor', '/club/:clubId/mentor'], clubController.getClubMentor);

router.get(['/students/:studentId/clubs', '/student/:studentId/clubs'], optionalAuth, clubController.getStudentClubs);
router.get(['/teachers/:teacherId/club', '/teacher/:teacherId/club', '/teachers/:teacherId/clubs'], optionalAuth, clubController.getTeacherClub);

// Club management routes
router.post(['/clubs', '/club'], optionalAuth, clubController.createClub);
router.put(['/clubs/:clubId', '/club/:clubId'], optionalAuth, clubController.updateClub);

export default router;

