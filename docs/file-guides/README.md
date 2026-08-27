# CertiVault File Guides

This directory contains documentation for file types in the CertiVault project that do not support inline comments (such as `.json` configurations or `.env` files). It also defines the global coding style and documentation standards for all source code files.

---

## 1. Mandatory File Header Rule

Every source code file created or significantly modified in this repository (e.g., `.js`, `.jsx`, `.css`) must begin with a short developer header comment explaining:

1. **What the file does**: A brief summary of the file's primary responsibility.
2. **Application Layer**: Which tier it belongs to (e.g., Client UI, Server Router, Database Model, Cryptographic Service).
3. **Interactions**: What other files, routes, or modules this file communicates with.
4. **Future Work**: What enhancements or modifications belong in this file in future steps.
5. **Boundary Rules (What should NOT be implemented here)**: Clarification on code or patterns that explicitly do not belong in this file (to prevent bloat or violation of clean architecture).

### Example Header for Javascript Files:
```javascript
/**
 * @file event.controller.js
 * @description Manages event retrieval and creation workflows.
 * @layer Server Controller
 * @interacts Client requests (via event routes), Event DB model
 * @futureWork Integrate pagination, add complex filtering.
 * @nonGoal Do not implement direct database connection or raw cryptographic signing here.
 */
```

---

## 2. Directory Layout Map

As the roadmap execution proceeds, the codebase will be structured as follows:

```
CertiVault/
├── docs/                     # Project documentation/constitution (Step 0)
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── API_PLAN.md
│   ├── SECURITY.md
│   ├── HASH_CHAIN.md
│   └── file-guides/          # Documentation for non-commentable files
├── client/                   # Vite + React Client SPA (PS-03 frontend / Step 8+)
│   ├── src/
│   │   ├── components/       # Reusable UI widgets (Navbar, Sidebar, Button, Input, Card, Badge, Modal and states)
│   │   ├── pages/            # Page-level route views for /, /login, /institution and /verify workflows
│   │   ├── services/         # Axios API connection layers
│   │   └── App.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── server/                   # Node + Express Server API (Step 1+)
    ├── src/
    │   ├── config/           # Environment and MongoDB connection lifecycle
    │   ├── controllers/      # Request handlers
    │   ├── middleware/       # Future auth validation and current API error handler
    │   ├── models/           # Mongoose schemas (empty until a domain model is needed)
    │   ├── routes/           # REST endpoints mapping
    │   ├── services/         # Reusable application services (health first; crypto/ledger later)
    │   ├── utils/            # Async-controller and JSON response utilities
    │   └── app.js
    ├── .env.example
    └── package.json
```

## 3. Backend Environment Files

`server/.env.example` documents the supported runtime variables. It may contain safe local examples but never real secrets or hosted MongoDB connection strings.

- `PORT`: HTTP listener port.
- `MONGO_URI`: MongoDB connection string. Required for a connected database health result.
- `JWT_SECRET`: reserved for the future authentication step; never expose it to the client.
- `FRONTEND_URL`: browser origin allowed by backend CORS.

The server's request boundary is `routes → controllers → services → models`. Routes must remain declarative; controllers must not contain persistence internals; services must not send HTTP responses; models must not contain route logic.
