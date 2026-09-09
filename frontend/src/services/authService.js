import { BASE_URLS, apiFetch } from '../config/api.js';

export const loginUser = async (credentials) => {
  const data = await apiFetch(`${BASE_URLS.AUTH}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (data?.token) {
    localStorage.setItem('agentverse_token', data.token);
    localStorage.setItem('agentverse_user', JSON.stringify(data.user));
  }
  return data;
};

export const registerUser = async (userData) => {
  const data = await apiFetch(`${BASE_URLS.AUTH}/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (data?.token) {
    localStorage.setItem('agentverse_token', data.token);
    localStorage.setItem('agentverse_user', JSON.stringify(data.user));
  }
  return data;
};

export const getProfile = async () => {
  return await apiFetch(`${BASE_URLS.AUTH}/me`);
};

export const getAuthData = async () => {
  return await getProfile();
};

