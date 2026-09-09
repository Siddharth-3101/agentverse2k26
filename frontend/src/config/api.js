// Centralized API Ports and Endpoints for AgentVerse AI Platform

export const PORTS = {
  UNIFIED: 5000,
  AUTH: 5001,
  CLUB: 5002,
  APPLICATION: 5003,
  NOTIFICATION: 5004,
  ACTIVITY: 5005,
  ANALYTICS: 5006,
};

// By default, endpoints point to the unified backend server or dedicated microservices
export const BASE_URLS = {
  UNIFIED: `http://localhost:${PORTS.UNIFIED}/api`,
  AUTH: `http://localhost:${PORTS.UNIFIED}/api`,
  CLUB: `http://localhost:${PORTS.UNIFIED}/api`,
  APPLICATION: `http://localhost:${PORTS.UNIFIED}/api`,
  NOTIFICATION: `http://localhost:${PORTS.UNIFIED}/api`,
  ACTIVITY: `http://localhost:${PORTS.UNIFIED}/api`,
  ANALYTICS: `http://localhost:${PORTS.UNIFIED}/api`,
};

/**
 * Universal Fetch Helper with token attachment and FormData support
 */
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('agentverse_token');

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    // Attempt primary URL, with fallback to unified server (port 5000) if microservice is offline
    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkErr) {
      // If microservice URL failed, try fallback to unified server
      if (url.includes(':500') && !url.includes(':5000')) {
        const unifiedUrl = url.replace(/:500[1-6]\/api/, ':5000/api');
        try {
          response = await fetch(unifiedUrl, { ...options, headers });
        } catch (e) {
          throw networkErr;
        }
      } else {
        throw networkErr;
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `HTTP ${response.status}: Request failed`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.warn(`[API Info] ${url}:`, err.message);
    throw err;
  }
}
