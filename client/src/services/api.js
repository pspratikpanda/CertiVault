/**
 * @file api.js
 * @description Centralized Axios HTTP client instance for CertiVault backend API communication with automatic port fallback.
 * @layer Client Service
 * @interacts Server REST API (/api), React Components & Hooks
 * @futureWork Add JWT token request interceptors in Step 3.
 * @nonGoal Do not contain UI state or component rendering logic here.
 */

import axios from 'axios';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

/**
 * Health check service call with dynamic port discovery (scans 5000..5005 if default fails)
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (err) {
    if (!import.meta.env.VITE_API_BASE_URL) {
      const candidatePorts = [5001, 5002, 5003, 5004, 5005];
      for (const port of candidatePorts) {
        try {
          const fallbackRes = await axios.get(`http://localhost:${port}/api/health`, { timeout: 3000 });
          api.defaults.baseURL = `http://localhost:${port}/api`;
          return fallbackRes.data;
        } catch (ignored) {
          // continue checking next port
        }
      }
    }
    throw err;
  }
};

export default api;
