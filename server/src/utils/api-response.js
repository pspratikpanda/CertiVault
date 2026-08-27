/**
 * @file api-response.js
 * @description Defines shared success and error JSON response conventions.
 * @layer Server Utility
 * @interacts Controllers and error middleware.
 * @futureWork Add pagination metadata helpers when list endpoints exist.
 * @nonGoal Do not include business rules or HTTP route definitions.
 */
export const sendSuccess = (res, { statusCode = 200, message, data } = {}) => res.status(statusCode).json({
  success: true,
  ...(message && { message }),
  ...(data !== undefined && { data }),
});

export const sendError = (res, { statusCode = 500, code = 'INTERNAL_SERVER_ERROR', message, details } = {}) => res.status(statusCode).json({
  success: false,
  error: {
    code,
    message: message || 'An unexpected error occurred.',
    ...(details && { details }),
  },
});
