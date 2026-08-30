/**
 * @file api.routes.js
 * @description Main API router combining all sub-routers under /api prefix.
 * @layer Server Router
 * @interacts app.js, health.routes.js and auth.routes.js.
 * @futureWork Mount credential and verification routes in their dedicated steps.
 * @nonGoal Do not contain endpoint business logic inline.
 */

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import credentialRoutes from './credential.routes.js';
import verificationRoutes from './verification.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/credentials/verify', verificationRoutes);
router.use('/credentials', credentialRoutes);

export default router;
