/**
 * @file env.js
 * @description Centralized environment configuration module loading and validating server runtime parameters.
 * @layer Server Config
 * @interacts process.env, server.js, app.js
 * @futureWork Add validation schema for MongoDB URI and Secret keys in Step 2/3.
 * @nonGoal Do not perform direct cryptographic operations or database initialization here.
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
