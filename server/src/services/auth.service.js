/**
 * @file auth.service.js
 * @description Encapsulates user registration, password verification, and JWT session creation.
 * @layer Server Service
 * @interacts user.model.js, env.js and auth.controller.js.
 * @futureWork Add account verification and recovery flows when specified.
 * @nonGoal Do not send HTTP responses or log passwords/tokens.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { USER_ROLES } from '../models/user.model.js';
import { config } from '../config/env.js';
import { apiError } from '../utils/api-error.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 12;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const assertSessionSecret = () => {
  if (!config.jwtSecret) throw apiError(500, 'AUTH_CONFIGURATION_ERROR', 'Authentication is not configured.');
};

export const toPublicUser = (user) => ({
  id: user._id.toString(),
  institutionName: user.institutionName,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerInstitution = async ({ institutionName, email, password, role }) => {
  if (typeof institutionName !== 'string' || institutionName.trim().length < 2 || institutionName.trim().length > 120) throw apiError(400, 'VALIDATION_ERROR', 'Institution name must contain 2 to 120 characters.');
  if (!EMAIL_PATTERN.test(normalizeEmail(email))) throw apiError(400, 'VALIDATION_ERROR', 'A valid email address is required.');
  if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) throw apiError(400, 'VALIDATION_ERROR', `Password must contain at least ${PASSWORD_MIN_LENGTH} characters.`);
  if (role && role !== USER_ROLES.INSTITUTION) throw apiError(403, 'ROLE_ASSIGNMENT_FORBIDDEN', 'Administrator accounts cannot be self-registered.');

  const normalizedEmail = normalizeEmail(email);
  const existing = await User.exists({ email: normalizedEmail });
  if (existing) throw apiError(409, 'ACCOUNT_ALREADY_EXISTS', 'An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const user = await User.create({ institutionName: String(institutionName).trim(), email: normalizedEmail, password: passwordHash, role: USER_ROLES.INSTITUTION });
    return toPublicUser(user);
  } catch (error) {
    if (error?.code === 11000) throw apiError(409, 'ACCOUNT_ALREADY_EXISTS', 'An account with this email already exists.');
    throw error;
  }
};

export const authenticateUser = async ({ email, password }) => {
  if (!EMAIL_PATTERN.test(normalizeEmail(email)) || typeof password !== 'string' || !password) throw apiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) throw apiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  return user;
};

export const createSessionToken = (user) => {
  assertSessionSecret();
  return jwt.sign({ role: user.role }, config.jwtSecret, { subject: user._id.toString(), expiresIn: config.jwtExpiresIn });
};

export const verifySessionToken = (token) => {
  assertSessionSecret();
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    throw apiError(401, 'INVALID_SESSION', 'Your session is invalid or has expired.');
  }
};

export const findSessionUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw apiError(401, 'INVALID_SESSION', 'Your session is no longer valid.');
  return user;
};
