/**
 * @file api-error.js
 * @description Creates typed errors that the centralized API error middleware can serialize safely.
 * @layer Server Utility
 * @interacts Controllers, services and error.middleware.js.
 * @futureWork Add domain-specific error constructors when required.
 * @nonGoal Do not expose stack traces or database errors to clients.
 */
export const apiError = (statusCode, code, message) => Object.assign(new Error(message), { statusCode, code });
