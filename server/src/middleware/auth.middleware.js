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
  // Check parsed cookies (if cookie-parser middleware is active)
  if (req.cookies?.certivault_session) return req.cookies.certivault_session;
  // Raw cookie header may be lower- or upper-cased depending on the client
  const raw = req.headers?.cookie || req.headers?.Cookie || '';
  const match = raw.split(';').find((c) => c.trim().startsWith('certivault_session='));
  if (match) return match.split('=')[1].trim();
  // Fallback to Authorization header if present
  const auth = String(req.headers?.authorization || '');
  const [scheme, token] = auth.split(' ');
  return scheme === 'Bearer' && token ? token.trim() : null;
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
