/**
 * @file database.js
 * @description Owns the Mongoose connection lifecycle and exposes connection state.
 * @layer Server Configuration
 * @interacts env.js, server.js, health.service.js and MongoDB.
 * @futureWork Configure production connection monitoring and metrics.
 * @nonGoal Do not define application models or request handlers here.
 */
import mongoose from 'mongoose';
import { config } from './env.js';

const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

export const getDatabaseState = () => ({
  connected: mongoose.connection.readyState === 1,
  state: states[mongoose.connection.readyState] || 'unknown',
  configured: Boolean(config.mongoUri),
  database: mongoose.connection.name || null,
});

export const connectDatabase = async () => {
  if (!config.mongoUri) {
    console.warn('[CertiVault] MONGO_URI is not configured; database connection is unavailable.');
    return getDatabaseState();
  }

  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
  const status = getDatabaseState();
  console.log(`[CertiVault] MongoDB connected${status.database ? ` (${status.database})` : ''}.`);
  return status;
};

export const disconnectDatabase = () => mongoose.disconnect();
