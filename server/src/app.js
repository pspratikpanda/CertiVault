/**
 * @file app.js
 * @description Express application setup module configuring global middleware, CORS, JSON parsing, and API routes.
 * @layer Server Application Setup
 * @interacts server.js, api.routes.js, error.middleware.js
 * @futureWork Add security headers and feature routers in their respective steps.
 * @nonGoal Do not call app.listen directly in this file.
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config } from './config/env.js';
import apiRoutes from './routes/api.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Dynamic CORS: supports multiple origins for dev + production deployments
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (config.frontendUrls.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api', apiRoutes);

// 404 handler for non-API routes
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

export default app;
