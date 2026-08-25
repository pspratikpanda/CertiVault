# CertiVault Development Roadmap

This roadmap documents the planned micro-steps to build the CertiVault system. We follow a strict step-by-step execution model, validating and verifying each step before proceeding.

---

## Roadmap Steps

### [DONE] Step 0: Project Documentation & Constitution
- Define system architecture, planned API structures, security principles, and single-node hash-chain logic.
- Establish file structure rules for the upcoming steps.

### [TODO] Step 1: Backend Server Setup
- Initialize the Express backend.
- Setup directory layout (controllers, models, routes, services, middleware).
- Configure MongoDB connection using Mongoose.
- Establish basic health check endpoint and error-handling middleware.

### [TODO] Step 2: Cryptographic Services Module
- Implement server-side hashing helper (SHA-256).
- Implement RSA key pair generator helper (generating institutional signing keys).
- Create digital signature signing and verification services using `crypto` module (`signature = Sign(privateKey, hash)` and `Verify(publicKey, hash, signature)`).
- Implement symmetric encryption/decryption utilities for securing private keys at rest using an environment variable.
- Add test scripts in `scratch/` to verify correctness.

### [TODO] Step 3: Institution Authentication
- Define Institution DB schema (name, email, password hash, public verification key, and private key encrypted at rest).
- Create Signup and Login routes with bcrypt password hashing.
- Build JWT generation and verification middleware.

### [TODO] Step 4: Ledger Schema & Chain Logic
- Define the `LedgerBlock` schema (index, timestamp, credentialId, dataHash, previousHash, signature, blockHash).
- Write ledger utility helper to retrieve the tail block of the chain.
- Write integrity validation logic (iterating the chain, verifying block hashes and `previousHash` links).

### [TODO] Step 5: Credential Model & Issuance APIs
- Define `Credential` schema using the canonical structure:
  - Immutable fields: `credentialId`, `studentName`, `studentId`, `degree`, `department`, `graduationDate`, `issueDate`, `institutionId`.
  - Verification fields: `credentialHash`, `signature`, `keyId`.
  - Mutable status: `status` (ACTIVE | REVOKED), `revokedAt`, `revokedBy`, `revocationReason`.
- Implement endpoint `POST /api/credentials/issue`.
- When issuing, backend hashes the canonical immutable data, signs the hash using the institution's decrypted private key, creates a ledger block referencing the credential, and writes both to the database.

### [TODO] Step 6: Credential Revocation Logic
- Implement endpoint `POST /api/credentials/revoke/:id`.
- Secure this endpoint so only the owning institution can revoke it.
- Mark the credential status as `REVOKED` and update the status metadata fields directly in the credential document.
- Note: This does **not** append a new block to the ledger, keeping the historical issuance records untouched.

### [TODO] Step 7: Public Verification APIs
- Implement endpoint `GET /api/credentials/verify/:id`.
- The endpoint will fetch the credential, fetch the matching block, verify the credential hash, verify the digital signature using the institution's public key, verify the block hash/linkage, and return status metadata.
- Return detailed verification status: `VERIFIED` (ACTIVE), `REVOKED`, or `TAMPERED/INVALID`.

### [TODO] Step 8: Frontend Core Setup
- Initialize React project using Vite.
- Install Tailwind CSS, React Router, and Axios.
- Configure theme properties (vibrant dark mode, premium glassmorphism layouts).

### [TODO] Step 9: Institution Dashboard UI
- Build Login/Register screens.
- Build Dashboard: View all issued credentials, Issue New Credential modal, and Revocation action triggers.

### [TODO] Step 10: Public Verification Portal UI
- Build search bar for ID/hash-based lookup.
- Integrate a QR scanner module to parse verification URLs directly.
- Build premium verification result card (showing details when authentic, revocation alerts, or warning animations when tampered).

### [TODO] Step 11: Tamper Demonstration Screen
- Build an interactive "Admin DB Playground" page.
- Show the raw MongoDB entries of credentials and ledger blocks.
- Provide a button to "Tamper with Data" (direct modification of an immutable credential field, such as `studentName` or `degree` in MongoDB).
- Show in real-time how verifying that credential immediately switches from `VERIFIED` to `TAMPERED` because the calculated hash no longer matches the stored `credentialHash`, and signature validation fails.

### [TODO] Step 12: Final Integration & Polishing
- Perform end-to-end testing of the complete application flow.
- Ensure all rules and security guidelines are met.
- Write final walkthrough reports.
