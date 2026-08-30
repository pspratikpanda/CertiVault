/**
 * @file auth.controller.js
 * @description Handles account registration, login, session inspection, and logout responses.
 * @layer Server Controller
 * @interacts auth.routes.js, auth.service.js and response utilities.
 * @futureWork Add approved password recovery and administrator provisioning workflows.
 * @nonGoal Do not contain password hashing, JWT signing, or database queries directly.
 */
import { authenticateUser, createSessionToken, registerInstitution, toPublicUser } from '../services/auth.service.js';
import { config } from '../config/env.js';
import { sendSuccess } from '../utils/api-response.js';

const sessionCookieOptions = (clear = false) => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'none' : 'lax',
  path: '/',
  ...(!clear && { maxAge: 12 * 60 * 60 * 1000 }),
});

export const register = async (req, res) => {
  const user = await registerInstitution(req.body || {});
  return sendSuccess(res, { statusCode: 201, message: 'Institution account created.', data: { user } });
};

export const login = async (req, res) => {
  const user = await authenticateUser(req.body || {});
  const token = createSessionToken(user);
  res.cookie('certivault_session', token, sessionCookieOptions());
  return sendSuccess(res, { message: 'Signed in successfully.', data: { user: toPublicUser(user) } });
};

export const getCurrentUser = (req, res) => sendSuccess(res, { data: { user: toPublicUser(req.user) } });

export const logout = (req, res) => {
  res.clearCookie('certivault_session', sessionCookieOptions(true));
  return sendSuccess(res, { message: 'Signed out successfully.' });
};

export const getAdminAccess = (req, res) => sendSuccess(res, { data: { role: req.user.role, access: 'admin' } });
