import { BASE_URLS, apiFetch } from '../config/api.js';

export const getClubs = async () => {
  return await apiFetch(BASE_URLS.CLUB);
};

export const getClubById = async (id) => {
  return await apiFetch(`${BASE_URLS.CLUB}/${id}`);
};

export const getClubMembers = async (id) => {
  return await apiFetch(`${BASE_URLS.CLUB}/${id}/members`);
};

export const getStudentClubs = async (studentId) => {
  return await apiFetch(`${BASE_URLS.CLUB}/student/${studentId}`);
};

export const getTeacherClub = async (teacherId) => {
  return await apiFetch(`${BASE_URLS.CLUB}/teacher/${teacherId}`);
};

export const createClub = async (clubData) => {
  return await apiFetch(BASE_URLS.CLUB, {
    method: 'POST',
    body: JSON.stringify(clubData),
  });
};

export const updateClub = async (id, clubData) => {
  return await apiFetch(`${BASE_URLS.CLUB}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clubData),
  });
};

export const getClubData = async () => {
  return await getClubs();
};

