import { Router } from 'express';
import * as clubController from '../controllers/clubController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Public / Authenticated view routes
router.get('/clubs', clubController.getClubs);
router.get('/clubs/:clubId', clubController.getClubById);
router.get('/clubs/:clubId/members', clubController.getClubMembers);
router.get('/clubs/:clubId/mentor', clubController.getClubMentor);

router.get('/students/:studentId/clubs', authenticateUser, clubController.getStudentClubs);
router.get('/teachers/:teacherId/club', authenticateUser, clubController.getTeacherClub);

// Admin / Teacher club management routes
router.post('/clubs', authenticateUser, requireRole('TEACHER', 'ADMIN'), clubController.createClub);
router.put('/clubs/:clubId', authenticateUser, requireRole('TEACHER', 'ADMIN'), clubController.updateClub);

export default router;
