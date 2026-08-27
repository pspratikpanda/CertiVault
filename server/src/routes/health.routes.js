/**
 * @file health.routes.js
 * @description Express router for health status endpoints.
 * @layer Server Router
 * @interacts health.controller.js, api.routes.js
 * @futureWork None.
 * @nonGoal Do not mount authentication or credential routes here.
 */

import { Router } from 'express';
import { getHealthStatus } from '../controllers/health.controller.js';

const router = Router();

router.get('/', getHealthStatus);

export default router;
