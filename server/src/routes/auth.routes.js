/**
 * @file auth.routes.js
 * @description Declares account and session endpoints, including an admin guard probe.
 * @layer Server Router
 * @interacts auth.controller.js and auth.middleware.js.
 * @futureWork Add password recovery routes only when their workflow is defined.
 * @nonGoal Do not define credential or cryptographic routes here.
 */
import { Router } from 'express';
import { getAdminAccess, getCurrentUser, login, logout, register } from '../controllers/auth.controller.js';
import { authorizeRoles, requireAuth } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', asyncHandler(requireAuth), getCurrentUser);
router.get('/admin', asyncHandler(requireAuth), authorizeRoles(USER_ROLES.ADMIN), getAdminAccess);

export default router;
