/**
 * @file async-handler.js
 * @description Passes rejected asynchronous controller work to Express error middleware.
 * @layer Server Utility
 * @interacts Route controllers and error.middleware.js.
 * @futureWork Use for all async controllers as API features are added.
 * @nonGoal Do not handle errors directly or contain controller logic.
 */
export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
