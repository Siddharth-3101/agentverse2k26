import { BASE_URLS, apiFetch } from '../config/api.js';

export const getEvents = async (query = {}) => {
  try {
    const params = new URLSearchParams(query).toString();
    const url = params ? `${BASE_URLS.ACTIVITY}/activities?${params}` : `${BASE_URLS.ACTIVITY}/activities`;
    const res = await apiFetch(url);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Event Service Fallback]:', err.message);
    return [];
  }
};

export const getEventById = async (id) => {
  const res = await apiFetch(`${BASE_URLS.ACTIVITY}/activities/${id}`);
  return res?.data || res;
};

export const createEvent = async (eventData) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/activities`, {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};

export const updateEvent = async (id, eventData) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = async (id) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/activities/${id}`, {
    method: 'DELETE',
  });
};

export const getStudentActivities = async (studentId) => {
  try {
    const res = await apiFetch(`${BASE_URLS.ACTIVITY}/students/${studentId}/activities`);
    return res?.data || res || [];
  } catch (err) {
    console.warn('[Student Activities Fallback]:', err.message);
    return [];
  }
};

export const registerForActivity = async (studentId, activityId, data = {}) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/students/${studentId}/activities`, {
    method: 'POST',
    body: JSON.stringify({ activityId, ...data }),
  });
};

export const getEventData = async () => {
  return await getEvents();
};
