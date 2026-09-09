import { BASE_URLS, apiFetch } from '../config/api.js';

export const getClubAlumni = async (clubId) => {
  try {
    const res = await apiFetch(`${BASE_URLS.CLUB}/clubs/${clubId}/alumni`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Alumni Service Fallback]:', err.message);
    return [];
  }
};

export const getAllAlumni = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await apiFetch(`${BASE_URLS.CLUB}/alumni${query ? '?' + query : ''}`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[All Alumni Fallback]:', err.message);
    return [];
  }
};

export const contactAlumnus = async (alumniId, data) => {
  return await apiFetch(`${BASE_URLS.CLUB}/alumni/${alumniId}/contact`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
