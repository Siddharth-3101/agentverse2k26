import { BASE_URLS, apiFetch } from '../config/api.js';

export const getStudentCertificates = async (studentId) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/student/${studentId}/certificates`);
};

export const addCertificate = async (studentId, certData) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/student/${studentId}/certificates`, {
    method: 'POST',
    body: JSON.stringify(certData),
  });
};

export const getCertificateData = async (studentId) => {
  if (studentId) {
    return await getStudentCertificates(studentId);
  }
  return [];
};

