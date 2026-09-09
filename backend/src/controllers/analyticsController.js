import * as analyticsService from '../services/analyticsService.js';

export async function getTeacherDashboard(req, res, next) {
  try {
    const teacherUserId = req.user.id;
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
