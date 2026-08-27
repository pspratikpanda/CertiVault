/**
 * @file api.routes.js
 * @description Main API router combining all sub-routers under /api prefix.
 * @layer Server Router
 * @interacts app.js, health.routes.js
 * @futureWork Mount auth, credentials, and verification routes in steps 3, 5, 7.
 * @nonGoal Do not contain endpoint business logic inline.
 */

import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);

export default router;
