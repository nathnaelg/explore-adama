
import axios from 'axios';
import { API_CONFIG } from '../api.config';

export const mlClient = axios.create({
  baseURL: API_CONFIG.ML_PROXY_URL,
  headers: {
    ...API_CONFIG.HEADERS,
    'x-api-key': API_CONFIG.ML_API_KEY,
  },
  timeout: API_CONFIG.TIMEOUT,
});

// ML Client doesn't need the complex auth refresh logic of the core client usually,
// but we can add error handling logging here if needed.
mlClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("ML Service Error:", error);
    return Promise.reject(error);
  }
);
