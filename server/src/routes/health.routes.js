/**
 * @file health.routes.js
 * @description Express router for health status endpoints.
 * @layer Server Router
 * @interacts health.controller.js, async-handler.js and api.routes.js.
 * @futureWork Add dependency probes only when dependencies are introduced.
 * @nonGoal Do not mount authentication or credential routes here.
 */

import { Router } from 'express';
import { getDatabaseHealthStatus, getHealthStatus } from '../controllers/health.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.get('/', asyncHandler(getHealthStatus));
router.get('/db', asyncHandler(getDatabaseHealthStatus));

export default router;
