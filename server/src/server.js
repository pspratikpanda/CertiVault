/**
 * @file server.js
 * @description Connects infrastructure then starts the Express HTTP server.
 * @layer Server Startup
 * @interacts app.js, env.js and database.js.
 * @futureWork Add graceful termination metrics.
 * @nonGoal Do not place route handlers or middlewares directly in server.js.
 */

import app from './app.js';
import { config } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

let PORT = config.port;

const startHttpServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`[CertiVault] Backend server running on port ${portToTry} in ${config.nodeEnv} mode`);
    console.log(`[CertiVault] Health check available at http://localhost:${portToTry}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && !process.env.PORT && portToTry < 5005) {
      console.warn(`[CertiVault] Port ${portToTry} is occupied. Retrying on port ${portToTry + 1}...`);
      startHttpServer(portToTry + 1);
    } else {
      console.error(`[CertiVault] Server startup error:`, err);
      process.exit(1);
    }
  });
};

const startServer = async () => {
  try {
    await connectDatabase();
    startHttpServer(PORT);
  } catch (error) {
    console.error('[CertiVault] MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`[CertiVault] Received ${signal}; closing database connection.`);
  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
