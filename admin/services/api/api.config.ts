
export const API_CONFIG = {
  BASE_URL: '/api',
  ML_PROXY_URL: '/ml',
  HEADERS: {
    'Content-Type': 'application/json',
  },
  ML_API_KEY: import.meta.env.VITE_ML_API_KEY,
  TIMEOUT: 30000,
};
