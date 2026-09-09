import { BASE_URLS, apiFetch } from '../config/api.js';

export const loginUser = async (credentials) => {
  const data = await apiFetch(`${BASE_URLS.AUTH}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  const token = data?.token || data?.data?.token;
  const user = data?.user || data?.data?.user;

  if (token) {
    localStorage.setItem('agentverse_token', token);
  }
  if (user) {
    localStorage.setItem('agentverse_user', JSON.stringify(user));
  }
  return data;
};

export const registerUser = async (userData) => {
  const data = await apiFetch(`${BASE_URLS.AUTH}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  const token = data?.token || data?.data?.token;
  const user = data?.user || data?.data?.user;

  if (token) {
    localStorage.setItem('agentverse_token', token);
  }
  if (user) {
    localStorage.setItem('agentverse_user', JSON.stringify(user));
  }
  return data;
};

export const getProfile = async () => {
  return await apiFetch(`${BASE_URLS.AUTH}/auth/me`);
};

export const getAuthData = async () => {
  return await getProfile();
};


