/**
 * @file api.js
 * @description Centralized Axios client using HttpOnly-cookie sessions for CertiVault API communication.
 * @layer Client Service
 * @interacts Server REST API (/api), React Components & Hooks
 * @futureWork Add safe request correlation when observability is introduced.
 * @nonGoal Do not store or manually attach JWTs from browser storage.
 */

import axios from 'axios';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
        } catch {
          // continue checking next port
        }
      }
    }
    throw err;
  }
};

export default api;
