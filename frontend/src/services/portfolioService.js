import { BASE_URLS, apiFetch } from '../config/api.js';

export const generatePortfolio = async () => {
  try {
    const res = await apiFetch(`${BASE_URLS.ACTIVITY}/portfolio/generate`, {
      method: 'POST',
    });
    return res?.data || res?.portfolio || res;
  } catch (err) {
    console.warn('[Portfolio Service Fallback]:', err.message);
    throw err;
  }
};

export const getPortfolioPDFUrl = () => {
  return `${BASE_URLS.ACTIVITY}/portfolio/pdf`;
};
