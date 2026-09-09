import { BASE_URLS, apiFetch } from '../config/api.js';

export const getEvents = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  const url = params ? `${BASE_URLS.ACTIVITY}?${params}` : BASE_URLS.ACTIVITY;
  return await apiFetch(url);
};

export const getEventById = async (id) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/${id}`);
};

export const createEvent = async (eventData) => {
  return await apiFetch(BASE_URLS.ACTIVITY, {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};

export const updateEvent = async (id, eventData) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = async (id) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/${id}`, {
    method: 'DELETE',
  });
};

export const getStudentActivities = async (studentId) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/student/${studentId}`);
};

export const registerForActivity = async (studentId, activityId, data = {}) => {
  return await apiFetch(`${BASE_URLS.ACTIVITY}/student/${studentId}/${activityId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getEventData = async () => {
  return await getEvents();
};

