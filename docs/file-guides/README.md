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
├── client/                   # Vite + React Client SPA (Step 8+)
│   ├── src/
│   │   ├── components/       # Reusable UI widgets
│   │   ├── pages/            # Page-level route views (Dashboard, Portal, etc.)
│   │   ├── services/         # Axios API connection layers
│   │   └── App.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── server/                   # Node + Express Server API (Step 1+)
    ├── src/
    │   ├── config/           # DB and server configs
    │   ├── controllers/      # Request handlers
    │   ├── middleware/       # Auth validation, error handler
    │   ├── models/           # Mongoose schemas
    │   ├── routes/           # REST endpoints mapping
    │   ├── services/         # Cryptography & Ledger functions
    │   └── app.js
    ├── .env.example
    └── package.json
```
