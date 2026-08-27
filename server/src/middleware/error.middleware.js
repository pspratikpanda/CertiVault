/**
 * @file error.middleware.js
 * @description Centralized error response and 404 handler middleware for Express app.
 * @layer Server Middleware
 * @interacts app.js
 * @futureWork Map domain errors as features are added.
 * @nonGoal Do not expose stack traces or database internals to API clients.
 */

/**
 * Handle 404 Not Found errors
 */
import { config } from '../config/env.js';
import { sendError } from '../utils/api-response.js';

export const notFoundHandler = (req, res) => sendError(res, {
  statusCode: 404,
  code: 'API_ROUTE_NOT_FOUND',
  message: `API route not found: ${req.method} ${req.originalUrl}`,
});

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  if (config.nodeEnv !== 'test') console.error('[CertiVault] API error:', err);
  return sendError(res, {
    statusCode,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: statusCode >= 500 ? 'An unexpected server error occurred.' : err.message,
  });
};
