# PS-03 Frontend Workflow

This document records the frontend-only workflow completed in Step 2. It is a static interface and must not be presented as a working credential-verification system.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Product landing page |
| `/login` | Institution portal sign-in placeholder |
| `/institution` | Institution overview with placeholder metrics |
| `/institution/credentials` | Placeholder credential list |
| `/institution/credentials/new` | Static credential issuance form |
| `/verify` | Public credential-ID lookup entry |
| `/verify/:credentialId` | Static demonstration result |

## Current boundaries

- No backend, API requests, persistence, or real credential records.
- No authentication or authorization.
- No QR scanning.
- No cryptographic hashing, signing, ledger checks, or validation.

The issue form and verify form show the intended navigation experience only. Their outcomes are deliberately marked as demo/static until their backend services are implemented.
