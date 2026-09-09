import { BASE_URLS, apiFetch } from '../config/api.js';

export const getStudentCertificates = async (studentId) => {
  try {
    const url = studentId
      ? `${BASE_URLS.ACTIVITY}/students/${studentId}/certificates`
      : `${BASE_URLS.ACTIVITY}/certificates`;
    const res = await apiFetch(url);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Certificate Service Fallback]:', err.message);
    return [];
  }
};

export const uploadCertificate = async (file) => {
  const formData = new FormData();
  formData.append('certificate', file);

  return await apiFetch(`${BASE_URLS.ACTIVITY}/certificates/upload`, {
    method: 'POST',
    body: formData,
  });
};

export const addCertificate = async (studentId, certData) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/certificates`, {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId, ...certData }),
  });
};

export const updateCertificateStatus = async (certId, status) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/certificates/${certId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const getCertificateData = async (studentId) => {
  return await getStudentCertificates(studentId);
};
