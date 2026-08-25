# CertiVault Security Principles

This document defines the security policies and guidelines for the CertiVault implementation.

---

## 1. Cryptographic Key Management & Protection

To maintain system integrity, keypairs are generated when an institution registers:
- **Asymmetric Signature Algorithm**: RSA-2048 or ECDSA will be used to generate signatures.
- **Digital Signature Terminology**:
  - Signatures are generated using: `signature = Sign(privateKey, credentialHash)`.
  - Signatures are verified using: `Verify(publicKey, credentialHash, signature) -> true / false`.
  - We do not define signatures as "encrypting the hash with a private key".
- **Private Key Encryption at Rest**:
  - Private keys must **never** be stored as plaintext in MongoDB.
  - They must be encrypted at rest in the database using a symmetric encryption algorithm (e.g. AES-256-GCM) with an application-level encryption key (`DB_ENCRYPTION_KEY`) sourced from environment variables.
  - The server decrypts the private key only in memory when generating a digital signature.
- **Private Key Isolation Boundaries**:
  - The private key is **never** sent to the frontend.
  - The private key is **never** returned by any API endpoint.
  - The private key is **never** logged.
  - The private key is **never** committed to Git.
  - The encryption key is stored exclusively in local environment configuration (`.env`).
  - Production environments must utilize a dedicated Key Management Service (KMS), Hardware Security Module (HSM), or equivalent secure vault.

---

## 2. PII & Ledger Privacy

Hash-chain ledgers are immutable, which presents privacy challenges (e.g., "Right to be Forgotten").
- **Zero Raw PII on the Ledger**: The hash-chain ledger block does **not** contain raw student names, identifiers, or other readable PII.
- **PII Isolation**: The ledger block only stores the SHA-256 hash of the canonical immutable credential data (`dataHash`).
- **Verifiable Linkage**: The verification portal queries the credential collection (which can be edited or deleted if needed, e.g., for deletion requests) and verifies if `SHA256(canonicalImmutableData)` matches the `dataHash` stored in the immutable block. If the credential is deleted, the ledger block remains, but there is no associated data to verify, maintaining privacy.
- **Immutable vs. Mutable Scope**: Cryptographic signatures are calculated strictly over the canonical immutable credential issuance data (`studentName`, `studentId`, `degree`, `department`, `graduationDate`, `issueDate`, `institutionId`). Mutable status metadata fields (`status`, `revokedAt`, `revokedBy`, `revocationReason`) are excluded from hashing to ensure status updates (such as revocation) do not break the historical hash or signature integrity.

---

## 3. Web & API Security

- **Password Hashing**: User/Institution passwords must be hashed using `bcrypt` (with a work factor of 10 or higher) before storage. Never store plaintext passwords.
- **Authentication**: JWT tokens are signed using a robust backend secret (`JWT_SECRET`) stored in the `.env` file. Session durations must be capped (e.g., 24 hours).
- **Input Validation**: All Express routes must validate request payloads. Sanitize input to block NoSQL injection (e.g., MongoDB query selector injections) and Cross-Site Scripting (XSS).
- **Authorization**: Endpoints for credential issuance and revocation must verify that the requesting institution's ID (derived from the JWT) matches the issuer fields.

---

## 4. Environment & Deployment Rules

- **Secrets Isolation**: Secrets must be loaded exclusively via environment variables using `dotenv`.
- **Environment Template**: A `.env.example` template will be provided to guide the setup.
- **No Commits of Secrets**: The `.env` file must remain explicitly added to `.gitignore`. No private keys or production credentials may be checked into Git.
- **Local Git Rules**: Git operations (commit, pull, push, branch creation) must be done manually by the developer. Antigravity will only suggest commit messages and inspect local state.
