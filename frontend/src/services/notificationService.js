// Notification & Application Data Service for AgentVerse
// Mentored Club: Agentic AI & Coding Society | Mentor: Dr. A. K. Gupta

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    applicationId: 1,
    studentName: 'Sabarish R',
    full_name: 'Sabarish R',
    studentId: '2025CS006',
    student_id_number: '2025CS006',
    email: 'sabarish.r@agentverse.edu',
    phoneNumber: '+91 98765 55667',
    phone_number: '+91 98765 55667',
    department: 'Computer Science & Engineering',
    yearOfStudy: '2nd Year',
    year_of_study: 2,
    clubName: 'Agentic AI & Coding Society',
    club_name: 'Agentic AI & Coding Society',
    reason: 'Passionate about multi-agent systems and contributing to high-performance AI tools on campus.',
    reason_to_join: 'Passionate about multi-agent systems and contributing to high-performance AI tools on campus.',
    skills: 'Python, LangChain, React, FastAPI, Git',
    status: 'PENDING',
    read: false,
    is_read: false,
    createdAt: '10 minutes ago',
    type: 'application'
  },
  {
    id: 2,
    applicationId: 2,
    studentName: 'Dinesh S',
    full_name: 'Dinesh S',
    studentId: '2024AD007',
    student_id_number: '2024AD007',
    email: 'dinesh.s@agentverse.edu',
    phoneNumber: '+91 98765 66778',
    phone_number: '+91 98765 66778',
    department: 'AI & Data Science',
    yearOfStudy: '3rd Year',
    year_of_study: 3,
    clubName: 'Agentic AI & Coding Society',
    club_name: 'Agentic AI & Coding Society',
    reason: 'Looking to build distributed vector search engines and participate in inter-collegiate hackathons.',
    reason_to_join: 'Looking to build distributed vector search engines and participate in inter-collegiate hackathons.',
    skills: 'PyTorch, Machine Learning, Data Pipelines, Python',
    status: 'PENDING',
    read: false,
    is_read: false,
    createdAt: '30 minutes ago',
    type: 'application'
  },
  {
    id: 3,
    applicationId: 3,
    studentName: 'Shalini S',
    full_name: 'Shalini S',
    studentId: '2025EE008',
    student_id_number: '2025EE008',
    email: 'shalini.s@agentverse.edu',
    phoneNumber: '+91 98765 77889',
    phone_number: '+91 98765 77889',
    department: 'Electrical & Electronics',
    yearOfStudy: '2nd Year',
    year_of_study: 2,
    clubName: 'Agentic AI & Coding Society',
    club_name: 'Agentic AI & Coding Society',
    reason: 'Interested in edge AI inference and embedded robotics sensors.',
    reason_to_join: 'Interested in edge AI inference and embedded robotics sensors.',
    skills: 'IoT, Microcontrollers, Python, Circuit Design',
    status: 'ACCEPTED',
    read: true,
    is_read: true,
    createdAt: 'Yesterday',
    type: 'application'
  }
];

export const getNotificationData = async (userId) => {
  if (userId) {
    try {
      return await getNotificationsByUserId(userId);
    } catch (e) {
      console.warn('[Notification API fallback]:', e.message);
    }
  }
  return [...INITIAL_NOTIFICATIONS];
};

import { BASE_URLS, apiFetch } from '../config/api.js';

export const submitClubApplication = async (applicationData) => {
  return await apiFetch(`${BASE_URLS.APPLICATION}/applications`, {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
};

export const getApplicationsByClub = async (clubId) => {
  return await apiFetch(`${BASE_URLS.APPLICATION}/applications/club/${clubId}`);
};

export const getApplicationsByStudent = async (studentId) => {
  return await apiFetch(`${BASE_URLS.APPLICATION}/applications/student/${studentId}`);
};

export const getTeacherApplications = async (teacherId) => {
  const url = teacherId
    ? `${BASE_URLS.APPLICATION}/applications/teacher/${teacherId}`
    : `${BASE_URLS.APPLICATION}/teachers/applications`;
  return await apiFetch(url);
};

export const reviewApplication = async (applicationId, reviewData) => {
  return await apiFetch(`${BASE_URLS.APPLICATION}/applications/${applicationId}/review`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  });
};

export const getNotificationsByUserId = async (userId) => {
  return await apiFetch(`${BASE_URLS.NOTIFICATION}/notifications/user/${userId}`);
};

export const markNotificationAsRead = async (notificationId, userId) => {
  return await apiFetch(`${BASE_URLS.NOTIFICATION}/notifications/${notificationId}/read`, {
    method: 'PUT',
    body: JSON.stringify({ userId }),
  });
};




