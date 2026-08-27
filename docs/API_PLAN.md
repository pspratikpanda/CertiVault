# CertiVault API Plan

This document details the planned REST API endpoints for the CertiVault backend.

## Base URL
`/api`

## Response Formats

### Standard Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User friendly message explaining what went wrong.",
    "details": []
  }
}
```

---

## 0. Health & System Endpoints

### `GET /api/health`
Returns API process operational status. It does not imply MongoDB is connected.
- **Auth Required**: No
- **Response**:
  ```json
  {
    "success": true,
    "message": "CertiVault API is running.",
    "data": {
      "status": "operational",
      "timestamp": "2026-08-27T00:00:00.000Z"
    }
  }
  ```

### `GET /api/health/db`
Returns MongoDB connection state from Mongoose.
- **Auth Required**: No
- **Status**: `200` when connected; `503` when the database is unavailable or `MONGO_URI` is not configured.
- **Response**:
  ```json
  {
    "success": true,
    "message": "MongoDB is connected.",
    "data": {
      "database": {
        "connected": true,
        "state": "connected",
        "configured": true,
        "database": "certivault"
      }
    }
  }
  ```

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Registers a new academic institution and automatically generates its cryptographic key pair.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "State University",
    "email": "admin@state.edu",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "institution": {
        "id": "inst_65a782b13e9a",
        "name": "State University",
        "email": "admin@state.edu",
        "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----"
      }
    }
  }
  ```

### `POST /api/auth/login`
Authenticates an institution and returns a JWT token.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "admin@state.edu",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "institution": {
        "id": "inst_65a782b13e9a",
        "name": "State University"
      }
    }
  }
  ```

---

## 2. Credential Endpoints

> [!IMPORTANT]
> The credentialHash MUST be computed only from the canonical immutable issuance data. Mutable status/revocation fields MUST NOT participate in credentialHash.


### `POST /api/credentials/issue`
Issues a new academic credential, signs the data hash, and appends a corresponding block to the ledger.
- **Auth Required**: Yes (JWT Token from Institution)
- **Request Body**:
  ```json
  {
    "studentName": "John Doe",
    "studentId": "SID-883902",
    "degree": "Bachelor of Science in Computer Science",
    "department": "Computer Science & Engineering",
    "graduationDate": "2026-05-15"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "credential": {
        "credentialId": "cred_82f1b0a5",
        "studentName": "John Doe",
        "studentId": "SID-883902",
        "degree": "Bachelor of Science in Computer Science",
        "department": "Computer Science & Engineering",
        "graduationDate": "2026-05-15",
        "issueDate": "2026-08-25T14:48:00.000Z",
        "institutionId": "inst_65a782b13e9a",
        "credentialHash": "4a5f82bb1923...",
        "signature": "81abdf7201c...",
        "keyId": "key_2026_01",
        "status": "ACTIVE",
        "revokedAt": null,
        "revokedBy": null,
        "revocationReason": null
      },
      "ledgerBlock": {
        "index": 12,
        "timestamp": "2026-08-25T14:48:00.000Z",
        "credentialId": "cred_82f1b0a5",
        "dataHash": "4a5f82bb1923...",
        "previousHash": "3f82aa9c01bf...",
        "signature": "81abdf7201c...",
        "blockHash": "cd9a83eb102..."
      },
      "verificationUrl": "https://certivault.net/verify/cred_82f1b0a5"
    }
  }
  ```

### `POST /api/credentials/revoke/:id`
Revokes an existing credential. Marks the status metadata field as `REVOKED`. The original ledger entry remains unchanged.
- **Auth Required**: Yes (JWT - MUST be the original issuing institution)
- **Request Body**:
  ```json
  {
    "reason": "Administrative Error"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "credentialId": "cred_82f1b0a5",
      "status": "REVOKED",
      "revokedAt": "2026-08-25T14:50:00.000Z",
      "revokedBy": "inst_65a782b13e9a",
      "revocationReason": "Administrative Error"
    }
  }
  ```

---

## 3. Public Verification Endpoints

### `GET /api/credentials/verify/:id`
Retrieves credential details and cryptographically validates the digital signature and ledger integrity chain.
- **Auth Required**: No
- **Response (Authentic & Active)**:
  ```json
  {
    "success": true,
    "data": {
      "status": "VERIFIED",
      "verificationState": {
        "hashValid": true,
        "signatureValid": true,
        "chainIntact": true,
        "credentialStatus": "ACTIVE"
      },
      "credential": {
        "credentialId": "cred_82f1b0a5",
        "studentName": "John Doe",
        "studentId": "SID-883902",
        "degree": "Bachelor of Science in Computer Science",
        "department": "Computer Science & Engineering",
        "graduationDate": "2026-05-15",
        "issueDate": "2026-08-25T14:48:00.000Z",
        "institutionId": "inst_65a782b13e9a",
        "credentialHash": "4a5f82bb1923...",
        "signature": "81abdf7201c...",
        "keyId": "key_2026_01",
        "status": "ACTIVE",
        "revokedAt": null,
        "revokedBy": null,
        "revocationReason": null
      }
    }
  }
  ```

- **Response (Revoked but Cryptographically Valid)**:
  ```json
  {
    "success": true,
    "data": {
      "status": "REVOKED",
      "verificationState": {
        "hashValid": true,
        "signatureValid": true,
        "chainIntact": true,
        "credentialStatus": "REVOKED"
      },
      "credential": {
        "credentialId": "cred_82f1b0a5",
        "studentName": "John Doe",
        "studentId": "SID-883902",
        "degree": "Bachelor of Science in Computer Science",
        "department": "Computer Science & Engineering",
        "graduationDate": "2026-05-15",
        "issueDate": "2026-08-25T14:48:00.000Z",
        "institutionId": "inst_65a782b13e9a",
        "credentialHash": "4a5f82bb1923...",
        "signature": "81abdf7201c...",
        "keyId": "key_2026_01",
        "status": "REVOKED",
        "revokedAt": "2026-08-25T14:50:00.000Z",
        "revokedBy": "inst_65a782b13e9a",
        "revocationReason": "Administrative Error"
      }
    }
  }
  ```

- **Response (Tampered / Cryptographically Invalid)**:
  ```json
  {
    "success": false,
    "error": {
      "code": "VERIFICATION_FAILED",
      "message": "Security Alert: This credential has been tampered with or the database ledger integrity has been broken.",
      "details": {
        "hashValid": false,
        "signatureValid": false,
        "chainIntact": false,
        "reason": "Calculated credential hash mismatch, invalid digital signature, or broken ledger linkage."
      }
    }
  }
  ```

---

## 4. Future / Optional Demonstration Features

### `GET /api/ledger/blocks`
Retrieves all blocks in the hash-chain ledger for transparency visualization or testing.
- **Auth Required**: No
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "blocks": [
        {
          "index": 0,
          "timestamp": "2026-08-25T00:00:00.000Z",
          "credentialId": "genesis_block",
          "dataHash": "genesis000...",
          "previousHash": "0000000000000000000000000000000000000000000000000000000000000000",
          "signature": "genesis_sig",
          "blockHash": "8f82ac2b..."
        }
      ]
    }
  }
  ```
