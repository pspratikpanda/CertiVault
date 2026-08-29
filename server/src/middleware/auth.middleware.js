/**
 * @file auth.middleware.js
 * @description Verifies JWT sessions and enforces role-based access for protected API routes.
 * @layer Server Middleware
 * @interacts auth.service.js and protected route declarations.
 * @futureWork Add token rotation only when a session-management design is approved.
 * @nonGoal Do not issue tokens, accept passwords, or define product permissions here.
 */
import { findSessionUser, verifySessionToken } from '../services/auth.service.js';
import { apiError } from '../utils/api-error.js';

const getToken = (req) => {
  if (req.cookies?.certivault_session) return req.cookies.certivault_session;
  const [scheme, token] = String(req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' ? token : null;
};

export const requireAuth = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return next(apiError(401, 'AUTHENTICATION_REQUIRED', 'Authentication is required.'));
  try {
    const payload = verifySessionToken(token);
    req.user = await findSessionUser(payload.sub);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(apiError(403, 'INSUFFICIENT_ROLE', 'You do not have permission to access this resource.'));
  return next();
};
