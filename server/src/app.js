/**
 * @file app.js
 * @description Express application setup module configuring global middleware, CORS, JSON parsing, and API routes.
 * @layer Server Application Setup
 * @interacts server.js, api.routes.js, error.middleware.js
 * @futureWork Attach database connection initialization hooks and security headers.
 * @nonGoal Do not call app.listen directly in this file.
 */

import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import apiRoutes from './routes/api.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middlewares
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
