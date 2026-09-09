/**
 * WeeklyAnalysisModel.js
 * Independent AI Weekly Activity Analysis Engine.
 *
 * Features:
 *   1. Dual Streaks: Tracks eventStreak & certificateStreak independently.
 *   2. Participation Velocity & Trend: Calculates week-over-week change (% increase/decrease/steady).
 *   3. 3-Category Breakdown: Distribution across Events, Certifications, Internships.
 *   4. Zero Text Insights: Excluded per user instruction.
 *   5. Grounded Data Only: All calculations derived strictly from actual input data.
 */

'use strict';

const OllamaService = require('./OllamaService');

class WeeklyAnalysisModel {
  constructor(options = {}) {
    this.ollama = new OllamaService(options);
  }

  /**
   * Analyze student activity over past weeks.
   * @param {Object} studentProfile - { student_id, name }
   * @param {Array}  certificates   - Stored certificates (with upload/issue dates)
   * @param {Array}  activities     - Event participations (with dates)
   * @param {Array}  internships    - Internship records (with dates)
   * @returns {Object} Weekly Analysis JSON
   */
  analyzeWeeklyActivity(studentProfile = {}, certificates = [], activities = [], internships = []) {
    const now = new Date();
    const currentWeekStr = this._getIsoWeekString(now);

    // 1. Dual Streaks Calculation
    const eventStreak       = this._calculateWeeklyStreak(activities);
    const certificateStreak = this._calculateWeeklyStreak(certificates);
    const combinedStreak    = Math.max(eventStreak, certificateStreak);

    // 2. Week-over-Week Participation Trend
    const trendAnalysis = this._calculateParticipationTrend(activities, certificates, internships, now);

    // 3. 3-Category Distribution
    const categoryBreakdown = this._calculateCategoryBreakdown(activities, certificates, internships);

    // 4. Activity Logs for current week
    const currentWeekActivities = this._filterCurrentWeekActivities(activities, certificates, internships, now);

    return {
      success   : true,
      student_id: studentProfile.student_id || studentProfile.roll_number || null,
      meta: {
        analyzed_at       : now.toISOString(),
        current_week      : currentWeekStr,
        analysis_engine   : 'AgentVerse Weekly Activity AI',
        data_grounding    : 'Strictly calculated from student database records only'
      },
      streaks: {
        event_streak      : eventStreak,
        certificate_streak: certificateStreak,
        combined_streak   : combinedStreak
      },
      participation_trend: {
        current_week_count : trendAnalysis.currentWeekCount,
        previous_week_count: trendAnalysis.previousWeekCount,
        trend              : trendAnalysis.trend, // INCREASED | DECREASED | STEADY
        percentage_change  : trendAnalysis.percentageChange,
        summary_text       : trendAnalysis.summaryText
      },
      category_breakdown: categoryBreakdown, // Events, Certifications, Internships
      weekly_activity_log: currentWeekActivities
    };
  }

  // ─── Dual Streaks Algorithm ──────────────────────────────────────────────────

  _calculateWeeklyStreak(items = []) {
    if (!items || items.length === 0) return 0;

    const weeksWithActivity = new Set();
    for (const item of items) {
      const d = item.date || item.issue_date || item.created_at || item.postedDate;
      if (d) {
        const dateObj = new Date(d);
        if (!isNaN(dateObj.getTime())) {
          weeksWithActivity.add(this._getIsoWeekString(dateObj));
        }
      }
    }

    let streak = 0;
    const today = new Date();

    // Check consecutive weeks backward from current week
    for (let i = 0; i < 52; i++) {
      const checkDate = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStr   = this._getIsoWeekString(checkDate);

      if (weeksWithActivity.has(weekStr)) {
        streak++;
      } else {
        // Allow current week in progress to be 0 without breaking streak if prev week had activity
        if (i === 0) continue;
        break;
      }
    }

    return streak;
  }

  // ─── Participation Trend Algorithm ──────────────────────────────────────────

  _calculateParticipationTrend(activities, certificates, internships, now) {
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const currentWeekStart  = new Date(now.getTime() - oneWeekMs);
    const previousWeekStart = new Date(now.getTime() - 2 * oneWeekMs);

    let currCount = 0;
    let prevCount = 0;

    const allItems = [
      ...activities.map(a => ({ date: a.date || a.created_at })),
      ...certificates.map(c => ({ date: c.date || c.created_at })),
      ...internships.map(i => ({ date: i.date || i.created_at }))
    ];

    for (const item of allItems) {
      if (!item.date) continue;
      const d = new Date(item.date);
      if (isNaN(d.getTime())) continue;

      if (d >= currentWeekStart && d <= now) {
        currCount++;
      } else if (d >= previousWeekStart && d < currentWeekStart) {
        prevCount++;
      }
    }

    let trend = 'STEADY';
    let percentChange = 0;

    if (prevCount === 0 && currCount > 0) {
      trend = 'INCREASED';
      percentChange = 100;
    } else if (prevCount === 0 && currCount === 0) {
      trend = 'STEADY';
      percentChange = 0;
    } else {
      const diff = currCount - prevCount;
      percentChange = Number(((diff / prevCount) * 100).toFixed(1));

      if (percentChange > 0)       trend = 'INCREASED';
      else if (percentChange < 0)  trend = 'DECREASED';
      else                        trend = 'STEADY';
    }

    let summaryText = 'Activity count remained steady compared to last week.';
    if (trend === 'INCREASED') {
      summaryText = `+${percentChange}% Increase in activity compared to last week.`;
    } else if (trend === 'DECREASED') {
      summaryText = `${percentChange}% Decrease in activity compared to last week.`;
    }

    return {
      currentWeekCount : currCount,
      previousWeekCount: prevCount,
      trend            : trend,
      percentageChange : percentChange,
      summaryText      : summaryText
    };
  }

  // ─── Category Breakdown ─────────────────────────────────────────────────────

  _calculateCategoryBreakdown(activities, certificates, internships) {
    let eventsCount = activities.length;
    let certsCount  = certificates.length;
    let internCount = internships.length;

    // Also count from certificates categories if provided
    for (const c of certificates) {
      const topCat = c.topLevelCategory || c.top_level_category;
      if (topCat === 'Events')       eventsCount++;
      if (topCat === 'Internships')  internCount++;
    }

    const total = eventsCount + certsCount + internCount;

    return {
      Events: {
        count     : eventsCount,
        percentage: total > 0 ? Number(((eventsCount / total) * 100).toFixed(1)) : 0
      },
      Certifications: {
        count     : certsCount,
        percentage: total > 0 ? Number(((certsCount / total) * 100).toFixed(1)) : 0
      },
      Internships: {
        count     : internCount,
        percentage: total > 0 ? Number(((internCount / total) * 100).toFixed(1)) : 0
      }
    };
  }

  // ─── Activity Log Filtering ──────────────────────────────────────────────────

  _filterCurrentWeekActivities(activities, certificates, internships, now) {
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const weekAgo   = new Date(now.getTime() - oneWeekMs);
    const log       = [];

    for (const a of activities) {
      const d = new Date(a.date || a.created_at || now);
      if (d >= weekAgo) {
        log.push({ type: 'EVENT', title: a.title || a.name || 'Event', date: a.date || null, category: 'Events' });
      }
    }

    for (const c of certificates) {
      const d = new Date(c.date || c.created_at || now);
      if (d >= weekAgo) {
        log.push({ type: 'CERTIFICATE', title: c.certificate_title || c.title || 'Certificate', date: c.date || null, category: c.topLevelCategory || 'Certifications' });
      }
    }

    return log;
  }

  // ─── ISO Week Helper ─────────────────────────────────────────────────────────

  _getIsoWeekString(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }
}

module.exports = WeeklyAnalysisModel;
