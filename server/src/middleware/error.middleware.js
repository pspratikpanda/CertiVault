/**
 * @file error.middleware.js
 * @description Centralized error response and 404 handler middleware for Express app.
 * @layer Server Middleware
 * @interacts app.js
 * @futureWork Handle custom cryptographic verification errors and MongoDB connection errors.
 * @nonGoal Do not suppress stack traces in development mode or alter standard success payload structure.
 */

/**
 * Handle 404 Not Found errors
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};
