import { Router } from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateUser(req, res, next);
  }
  next();
};

// ─── Teacher & Platform Dashboard Analytics ─────────────────────────────────
router.get(['/analytics/teacher/dashboard', '/teacher/dashboard'], optionalAuth, analyticsController.getTeacherDashboard);
router.get(['/analytics/teacher/:teacherId', '/teacher/:teacherId', '/analytics/teachers/:teacherId'], optionalAuth, analyticsController.getTeacherDashboard);
router.get(['/analytics/overall', '/overall'], analyticsController.getOverallAnalytics);
router.get(['/analytics/leaderboard', '/leaderboard'], analyticsController.getLeaderboard);

// ─── Club Analytics Breakdown ───────────────────────────────────────────────
router.get(['/analytics/club/:clubId', '/analytics/clubs/:clubId'], optionalAuth, analyticsController.getClubAnalytics);
router.get(['/analytics/club/:clubId/members', '/analytics/clubs/:clubId/members'], optionalAuth, analyticsController.getClubMembersAnalytics);
router.get(['/analytics/club/:clubId/applications', '/analytics/clubs/:clubId/applications'], optionalAuth, analyticsController.getClubApplicationsAnalytics);
router.get(['/analytics/club/:clubId/activities', '/analytics/clubs/:clubId/activities'], optionalAuth, analyticsController.getClubActivitiesAnalytics);
router.get(['/analytics/club/:clubId/departments', '/analytics/clubs/:clubId/departments'], optionalAuth, analyticsController.getClubDepartments);
router.get(['/analytics/club/:clubId/membership-growth', '/analytics/clubs/:clubId/membership-growth'], optionalAuth, analyticsController.getClubMembershipGrowth);

// ─── AI Analytics, Career Roadmaps & Recommendations ────────────────────────
router.get(['/analytics/weekly', '/weekly'], optionalAuth, analyticsController.getWeeklyActivity);
router.get(['/career/roles', '/analytics/career/roles', '/careers/roles'], analyticsController.getCareerRoles);
router.post(['/career/evaluate', '/analytics/career/evaluate', '/careers/evaluate'], optionalAuth, analyticsController.evaluateCareer);
router.get(['/career/evaluate', '/analytics/career/evaluate', '/careers/evaluate'], optionalAuth, analyticsController.evaluateCareer);
router.get(['/recommendations/clubs', '/analytics/recommendations/clubs', '/recommendation/clubs'], optionalAuth, analyticsController.getRecommendedClubs);
router.get(['/recommendations/events', '/analytics/recommendations/events', '/recommendation/events', '/recommendations/activities'], optionalAuth, analyticsController.getRecommendedEvents);

export default router;

