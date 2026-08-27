/**
 * @file env.js
 * @description Centralizes and validates the environment values consumed by the backend.
 * @layer Server Config
 * @interacts process.env, server.js, app.js
 * @futureWork Add a schema validator when additional configuration is introduced.
 * @nonGoal Do not perform direct cryptographic operations or database initialization here.
 */

import dotenv from 'dotenv';

dotenv.config();

const requiredInProduction = ['MONGO_URI', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variable(s): ${missing.join(', ')}`);
  }
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
