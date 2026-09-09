import { BASE_URLS, apiFetch } from '../config/api.js';

export const getStudentData = async (studentId) => {
  if (!studentId) return [];
  return await apiFetch(`${BASE_URLS.ACTIVITY}/student/${studentId}`);
};

