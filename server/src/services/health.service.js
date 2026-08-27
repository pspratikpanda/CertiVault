/**
 * @file health.service.js
 * @description Provides system and database status data for health controllers.
 * @layer Server Service
 * @interacts database.js and health.controller.js.
 * @futureWork Include dependency latency and version metadata where useful.
 * @nonGoal Do not perform writes or expose application secrets.
 */
import { getDatabaseState } from '../config/database.js';

export const getSystemHealth = () => ({ status: 'operational', timestamp: new Date().toISOString() });

export const getDatabaseHealth = () => getDatabaseState();
