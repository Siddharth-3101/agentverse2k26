import { BASE_URLS, apiFetch } from '../config/api.js';

export const getClubs = async () => {
  try {
    const res = await apiFetch(`${BASE_URLS.CLUB}/clubs`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Club Service Fallback]:', err.message);
    return [];
  }
};

export const getClubById = async (id) => {
  const res = await apiFetch(`${BASE_URLS.CLUB}/clubs/${id}`);
  return res?.data || res;
};

export const getClubMembers = async (id) => {
  const res = await apiFetch(`${BASE_URLS.CLUB}/clubs/${id}/members`);
  return res?.data || res || [];
};

export const getStudentClubs = async (studentId) => {
  try {
    const res = await apiFetch(`${BASE_URLS.CLUB}/students/${studentId}/clubs`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Student Clubs Fallback]:', err.message);
    return [];
  }
};

export const getTeacherClub = async (teacherId) => {
  try {
    const res = await apiFetch(`${BASE_URLS.CLUB}/teachers/${teacherId}/club`);
    return res?.data || res;
  } catch (err) {
    console.warn('[Teacher Club Fallback]:', err.message);
    return null;
  }
};

export const createClub = async (clubData) => {
  return await apiFetch(`${BASE_URLS.CLUB}/clubs`, {
    method: 'POST',
    body: JSON.stringify(clubData),
  });
};

export const updateClub = async (id, clubData) => {
  return await apiFetch(`${BASE_URLS.CLUB}/clubs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clubData),
  });
};

export const getClubData = async () => {
  return await getClubs();
};
