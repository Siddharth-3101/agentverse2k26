// Teacher Service for AgentVerse
// Assigned Teacher: John Teacher | Mentored Club: Coding Club ONLY

export const TEACHER_PROFILE = {
  name: 'John Teacher',
  staffId: 'STF001',
  phoneNumber: '9876543210',
  department: 'Computer Science and Engineering',
  club: 'Coding Club'
};

export const CLUB_SUMMARY = {
  clubName: 'Coding Club',
  category: 'Technical & Innovation',
  totalMembers: 128,
  pendingApplications: 3,
  upcomingActivitiesCount: 3,
  upcomingActivities: [
    {
      id: 'act-1',
      title: 'Spring CodeSprint 2026',
      date: 'Tomorrow, 4:00 PM',
      venue: 'Computer Lab 3 & Online',
      type: 'Competition'
    },
    {
      id: 'act-2',
      title: 'System Design & Microservices Workshop',
      date: 'Saturday, 10:00 AM',
      venue: 'Seminar Hall B',
      type: 'Workshop'
    },
    {
      id: 'act-3',
      title: 'Open Source Mentorship Circle',
      date: 'Next Tuesday, 5:30 PM',
      venue: 'Innovation Hub',
      type: 'Community Meetup'
    }
  ]
};

import { BASE_URLS, apiFetch } from '../config/api.js';

export const getLeaderboard = async () => {
  return await apiFetch(`${BASE_URLS.ANALYTICS}/leaderboard`);
};

export const getTeacherAnalytics = async (teacherId) => {
  return await apiFetch(`${BASE_URLS.ANALYTICS}/teacher/${teacherId}`);
};

export const getOverallAnalytics = async () => {
  return await apiFetch(`${BASE_URLS.ANALYTICS}/overall`);
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

