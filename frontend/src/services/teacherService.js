// Teacher Service for AgentVerse
// Default Assigned Teacher: Dr. A. K. Gupta | Mentored Club: Agentic AI & Coding Society

export const TEACHER_PROFILE = {
  id: 9,
  name: 'Dr. A. K. Gupta',
  staffId: 'STF001',
  phoneNumber: '+91 98112 23344',
  department: 'Computer Science & Engineering',
  club: 'Agentic AI & Coding Society',
  club_id: 1,
  email: 'dr.gupta@agentverse.edu'
};

export const CLUB_SUMMARY = {
  id: 1,
  clubName: 'Agentic AI & Coding Society',
  category: 'Technical & Innovation',
  totalMembers: 42,
  pendingApplications: 2,
  upcomingActivitiesCount: 3,
  president_name: 'Siddharth G',
  vp_name: 'Sanjay Krishna',
  upcomingActivities: [
    {
      id: 'act-1',
      title: 'Spring Agentic CodeSprint 2026',
      date: 'Tomorrow, 4:00 PM',
      venue: 'Computer Lab 3 & Online',
      type: 'Competition'
    },
    {
      id: 'act-2',
      title: 'System Design & LLM Agents Workshop',
      date: 'Saturday, 10:00 AM',
      venue: 'Seminar Hall B',
      type: 'Workshop'
    },
    {
      id: 'act-3',
      title: 'Open Source Multi-Agent Meetup',
      date: 'Next Tuesday, 5:30 PM',
      venue: 'Innovation Hub',
      type: 'Community Meetup'
    }
  ]
};

import { BASE_URLS, apiFetch } from '../config/api.js';

export const getLeaderboard = async () => {
  return await apiFetch(`${BASE_URLS.ANALYTICS}/analytics/leaderboard`);
};

export const getTeacherAnalytics = async (teacherId) => {
  return await apiFetch(`${BASE_URLS.ANALYTICS}/analytics/teacher/${teacherId}`);
};

export const getOverallAnalytics = async () => {
  return await apiFetch(`${BASE_URLS.ANALYTICS}/analytics/overall`);
};


export const getTeacherData = async (teacherId) => {
  if (teacherId) {
    try {
      return await getTeacherAnalytics(teacherId);
    } catch (e) {
      console.warn('[Teacher Analytics API fallback]:', e.message);
    }
  }
  return {
    profile: TEACHER_PROFILE,
    club: CLUB_SUMMARY
  };
};


