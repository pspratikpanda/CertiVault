/**
 * @file health.controller.js
 * @description Handles API and MongoDB health-status requests.
 * @layer Server Controller
 * @interacts health.routes.js, health.service.js and api-response.js.
 * @futureWork Add safe dependency latency metrics.
 * @nonGoal Do not handle business logic, issuance, or auth here.
 */

/**
 * Get system health status
 * @route GET /api/health
 */
import { getDatabaseHealth, getSystemHealth } from '../services/health.service.js';
import { sendSuccess } from '../utils/api-response.js';

export const getHealthStatus = (req, res) => sendSuccess(res, {
  message: 'CertiVault API is running.',
  data: getSystemHealth(),
});

export const getDatabaseHealthStatus = (req, res) => {
  const database = getDatabaseHealth();
  return sendSuccess(res, {
    statusCode: database.connected ? 200 : 503,
    message: database.connected ? 'MongoDB is connected.' : 'MongoDB is not connected.',
    data: { database },
  });
};
