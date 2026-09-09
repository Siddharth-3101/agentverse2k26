import { BASE_URLS, apiFetch } from '../config/api.js';

export const getCareerRoles = async () => {
  try {
    const res = await apiFetch(`${BASE_URLS.ANALYTICS}/career/roles`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Career Roles Fallback]:', err.message);
    return [
      'Frontend Developer',
      'Backend Developer',
      'AI / ML Engineer',
      'Cybersecurity Analyst',
      'DevOps & Cloud Engineer',
      'Full Stack Developer',
      'iOS Developer',
      'Data Analyst',
      'AWS Cloud Engineer',
      'Blockchain Developer'
    ];
  }
};

export const evaluateCareer = async (selectedRole) => {
  try {
    const res = await apiFetch(`${BASE_URLS.ANALYTICS}/career/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ selectedRole }),
    });
    return res?.data || res;
  } catch (err) {
    console.warn('[Career Evaluation Fallback]:', err.message);
    throw err;
  }
};

export const getWeeklyAnalytics = async () => {
  try {
    const res = await apiFetch(`${BASE_URLS.ANALYTICS}/analytics/weekly`);
    return res?.data || res;
  } catch (err) {
    console.warn('[Weekly Analytics Fallback]:', err.message);
    return {
      streaks: { event_streak: 2, certificate_streak: 1, combined_streak: 2 },
      trend: { trend: 'INCREASED', percentage_change: 25 },
      categories: { Events: { count: 3 }, Certifications: { count: 1 }, Internships: { count: 0 } },
    };
  }
};

export const getRecommendedClubs = async () => {
  try {
    const res = await apiFetch(`${BASE_URLS.ANALYTICS}/recommendations/clubs`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Club Recs Fallback]:', err.message);
    return [];
  }
};

export const getRecommendedEvents = async () => {
  try {
    const res = await apiFetch(`${BASE_URLS.ANALYTICS}/recommendations/events`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Event Recs Fallback]:', err.message);
    return [];
  }
};
