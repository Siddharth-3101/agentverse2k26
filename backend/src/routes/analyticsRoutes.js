import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

// Teacher Dashboard Analytics
router.get('/analytics/teacher/dashboard', authenticateUser, requireRole('TEACHER', 'ADMIN'), analyticsController.getTeacherDashboard);

// Club Analytics Breakdown
router.get('/analytics/club/:clubId', authenticateUser, analyticsController.getClubAnalytics);
router.get('/analytics/club/:clubId/members', authenticateUser, analyticsController.getClubMembersAnalytics);
router.get('/analytics/club/:clubId/applications', authenticateUser, analyticsController.getClubApplicationsAnalytics);
router.get('/analytics/club/:clubId/activities', authenticateUser, analyticsController.getClubActivitiesAnalytics);
router.get('/analytics/club/:clubId/departments', authenticateUser, analyticsController.getClubDepartments);
router.get('/analytics/club/:clubId/membership-growth', authenticateUser, analyticsController.getClubMembershipGrowth);

// Overall Leaderboard
router.get('/analytics/leaderboard', analyticsController.getLeaderboard);

export default router;
