/**
 * @file server.js
 * @description HTTP Server entry point starting the Express application on configured PORT with automatic fallback if ports are occupied.
 * @layer Server Startup
 * @interacts app.js, config/env.js
 * @futureWork Connect to MongoDB instance before opening HTTP listener.
 * @nonGoal Do not place route handlers or middlewares directly in server.js.
 */

import app from './app.js';
import { config } from './config/env.js';

let PORT = config.port;

const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`[CertiVault] Backend server running on port ${portToTry} in ${config.nodeEnv} mode`);
    console.log(`[CertiVault] Health check available at http://localhost:${portToTry}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && !process.env.PORT && portToTry < 5005) {
      console.warn(`[CertiVault] Port ${portToTry} is occupied. Retrying on port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error(`[CertiVault] Server startup error:`, err);
      process.exit(1);
    }
  });
};

startServer(PORT);
