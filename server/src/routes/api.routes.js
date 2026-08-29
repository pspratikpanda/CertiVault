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

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

export default router;
