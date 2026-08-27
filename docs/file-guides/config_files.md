# Configuration & Non-Commentable File Guides

This guide documents the purpose, structure, and constraints for configuration and environment files across `client/` and `server/`.

---

## 1. `server/package.json`
- **Purpose**: Defines dependencies, scripts, and module settings for the backend API.
- **Type**: `"module"` (ESM syntax using `import`/`export`).
- **Dependencies**: `express`, `cors`, `dotenv`.
- **DevDependencies**: `nodemon` for auto-reloading during development.
- **Scripts**:
  - `npm start`: Runs `node src/server.js`.
  - `npm run dev`: Runs `nodemon src/server.js`.

---

## 2. `server/.env.example`
- **Purpose**: Template for backend environment variables.
- **Fields**:
  - `PORT`: HTTP port (default `5000`).
  - `NODE_ENV`: Runtime environment (`development` / `production`).
  - `CORS_ORIGIN`: Allowed frontend origin (`http://localhost:5173`).
- **Rule**: Never commit secrets or actual `.env` files.

---

## 3. `client/.env.example`
- **Purpose**: Template for frontend environment variables.
- **Fields**:
  - `VITE_API_BASE_URL`: Base backend URL (`http://localhost:5000/api`).
- **Rule**: Prefix all client-side variables with `VITE_`.

---

## 4. Source Files Quick Guide

| File | Layer | Primary Responsibility |
|---|---|---|
| `server/src/server.js` | Server Startup | Binds Express app to HTTP port |
| `server/src/app.js` | Express Setup | Configures CORS, parsers, and mounts `/api` routes |
| `server/src/routes/health.routes.js` | Server Router | Maps `GET /` health check endpoint |
| `server/src/controllers/health.controller.js` | Server Controller | Returns `{ success: true, message: "CertiVault API is running" }` |
| `client/src/services/api.js` | Client Service | Configured Axios HTTP client for `/api` requests |
| `client/src/layouts/MainLayout.jsx` | Client Layout | Modern dark-mode layout with nav header & footer |
| `client/src/pages/LandingPage.jsx` | Client Page | Hero banner & live API health connectivity monitor |
