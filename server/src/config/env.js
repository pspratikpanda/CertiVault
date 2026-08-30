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

const requiredInProduction = ['MONGO_URI', 'JWT_SECRET', 'DB_ENCRYPTION_KEY'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variable(s): ${missing.join(', ')}`);
  }
}

const isProduction = process.env.NODE_ENV === 'production';

// FRONTEND_URL supports comma-separated origins for multi-domain CORS
const parseFrontendUrls = (raw) => {
  if (!raw) return ['http://localhost:5173'];
  return raw.split(',').map((u) => u.trim()).filter(Boolean);
};

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  dbEncryptionKey: process.env.DB_ENCRYPTION_KEY || '',
  frontendUrls: parseFrontendUrls(process.env.FRONTEND_URL),
  frontendUrl: parseFrontendUrls(process.env.FRONTEND_URL)[0],
  jwtExpiresIn: '12h',
};
