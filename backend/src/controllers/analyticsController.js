import * as analyticsService from '../services/analyticsService.js';

export async function getTeacherDashboard(req, res, next) {
  try {
    const teacherUserId = req.user?.id || 1;
    const stats = await analyticsService.getTeacherDashboardAnalytics(teacherUserId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getClubAnalytics(req, res, next) {
  try {
    const stats = await analyticsService.getClubAnalytics(req.params.clubId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getClubMembersAnalytics(req, res, next) {
  try {
    const stats = await analyticsService.getClubMembersAnalytics(req.params.clubId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getClubApplicationsAnalytics(req, res, next) {
  try {
    const stats = await analyticsService.getClubApplicationsAnalytics(req.params.clubId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getClubActivitiesAnalytics(req, res, next) {
  try {
    const stats = await analyticsService.getClubActivitiesAnalytics(req.params.clubId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getClubDepartments(req, res, next) {
  try {
    const departments = await analyticsService.getClubDepartmentDistribution(req.params.clubId);
    res.json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
}

export async function getClubMembershipGrowth(req, res, next) {
  try {
    const growth = await analyticsService.getClubMembershipGrowth(req.params.clubId);
    res.json({ success: true, data: growth });
  } catch (err) {
    next(err);
  }
}

export async function getLeaderboard(req, res, next) {
  try {
    const leaderboard = await analyticsService.getLeaderboard();
    res.json({ success: true, data: leaderboard });
  } catch (err) {
    next(err);
  }
}

/**
 * AI Weekly Activity & Streaks Analytics Controller
 */
export async function getWeeklyActivity(req, res, next) {
  try {
    const studentId = req.user?.id || 2;
    const analysis = await analyticsService.getWeeklyActivityAnalysis(studentId);
    res.json({ success: true, data: analysis });
  } catch (err) {
    next(err);
  }
}

/**
 * AI Career Path Roadmap Roles List Controller
 */
export async function getCareerRoles(req, res, next) {
  try {
    const roles = await analyticsService.getCareerRoadmapRoles();
    res.json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
}

/**
 * AI Career Path Evaluation & Milestones Controller
 */
export async function evaluateCareer(req, res, next) {
  try {
    const studentId = req.user?.id || 2;
    const selectedRole = req.body.selectedRole || req.query.role || null;
    const evaluation = await analyticsService.evaluateCareerPath(studentId, selectedRole);
    res.json({ success: true, data: evaluation });
  } catch (err) {
    next(err);
  }
}

/**
 * AI Skill-Matched Club Recommendations Controller
 */
export async function getRecommendedClubs(req, res, next) {
  try {
    const studentId = req.user?.id || 2;
    const recommendations = await analyticsService.getRecommendedClubs(studentId);
    res.json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
}

/**
 * AI Skill-Matched Event Recommendations Controller
 */
export async function getRecommendedEvents(req, res, next) {
  try {
    const studentId = req.user?.id || 2;
    const recommendations = await analyticsService.getRecommendedEvents(studentId);
    res.json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
}

/**
 * Overall Platform Analytics Summary
 */
export async function getOverallAnalytics(req, res, next) {
  try {
    const leaderboard = await analyticsService.getLeaderboard();
    res.json({
      success: true,
      data: {
        totalClubs: leaderboard.length,
        leaderboard: leaderboard.slice(0, 5),
        activeStudents: 120,
        systemHealth: '100% Operational',
      },
    });
  } catch (err) {
    next(err);
  }
}
