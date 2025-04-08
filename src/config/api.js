const API_URL = import.meta.env.VITE_API_URL || 'http://devsecops-backend:3000';

export const apiConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default apiConfig;