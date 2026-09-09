// Centralized Microservice Ports and API Helpers for AgentVerse

export const PORTS = {
  AUTH: 5001,
  CLUB: 5002,
  APPLICATION: 5003,
  NOTIFICATION: 5004,
  ACTIVITY: 5005,
  ANALYTICS: 5006,
};

export const BASE_URLS = {
  AUTH: `http://localhost:${PORTS.AUTH}/api/auth`,
  CLUB: `http://localhost:${PORTS.CLUB}/api/clubs`,
  APPLICATION: `http://localhost:${PORTS.APPLICATION}/api/applications`,
  NOTIFICATION: `http://localhost:${PORTS.NOTIFICATION}/api/notifications`,
  ACTIVITY: `http://localhost:${PORTS.ACTIVITY}/api/activities`,
  ANALYTICS: `http://localhost:${PORTS.ANALYTICS}/api/analytics`,
};

/**
 * Universal Fetch Helper with Token handling and Error parsing
 */
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('agentverse_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `HTTP ${response.status}: Request failed`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${url}:`, err.message);
    throw err;
  }
}
