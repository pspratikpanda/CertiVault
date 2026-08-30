# System Flow: Issuance & Verification

This document details the architectural flows for credential registration, issuance, and cryptographic verification within CertiVault.

---

## 1. Key Generation & Registration Flow

When a new educational institution signs up, the system generates a dedicated cryptographic identity for signing future credentials.

```mermaid
sequenceDiagram
    actor Institution
    participant Server as Express Server
    participant Crypto as Crypto Module
    participant DB as MongoDB Atlas
    
    Institution->>Server: Register Account (Name, Email, Password)
    Server->>Crypto: Generate RSA-2048 Keypair
    Crypto-->>Server: Return {publicKey, privateKey}
    Server->>Crypto: Encrypt Private Key (AES-256-GCM + DB_ENCRYPTION_KEY)
    Crypto-->>Server: Return encryptedPrivateKey
    Server->>DB: Store User {institutionName, email, passwordHash, publicKey, encryptedPrivateKey}
    DB-->>Server: Saved Successfully
    Server-->>Institution: Registration Success
```

---

## 2. Credential Issuance Flow

To issue a tamper-proof credential, the institution submits the student details. The server constructs the credential and seals it inside a single-node tamper-evident ledger.

```mermaid
sequenceDiagram
    actor Institution
    participant Server as Express Server
    participant DB as MongoDB Atlas
    participant Crypto as Crypto Module
    participant Ledger as Ledger Service

    Institution->>Server: Submit Student Data (Name, Degree, etc.)
    Server->>DB: Fetch Institution (with encrypted privateKey)
    DB-->>Server: Return Encrypted Key
    Server->>Crypto: Decrypt Private Key (AES-256-GCM)
    Crypto-->>Server: Return Raw RSA Private Key
    
    Server->>Crypto: Compute Deterministic SHA-256 of Student Data
    Crypto-->>Server: Return credentialHash
    Server->>Crypto: Sign credentialHash with RSA Private Key
    Crypto-->>Server: Return signature
    
    Server->>Ledger: Request New Block Creation
    Ledger->>DB: Get Tail Block (Index, blockHash)
    DB-->>Ledger: Return tail block details
    Ledger->>Ledger: Calculate Next Block Index & previousHash
    Ledger->>Ledger: Compute Block Hash = SHA-256(index + timestamp + credentialId + credentialHash + previousHash + signature)
    Ledger->>DB: Save LedgerBlock
    
    Server->>DB: Save Credential Record (Data + credentialHash + signature)
    Server-->>Institution: Success & return verificationUrl & QR Code
```

---

## 3. Credential Verification Flow

Verification is completely public. When someone scans a QR code or queries a credential ID, the system performs a 5-step integrity audit.

```mermaid
flowchart TD
    Start([Start Verification]) --> Load[Load Credential & Associated Ledger Block]
    
    Load --> Step1{Step 1: Data Integrity<br>Does recalculated student data hash match stored credentialHash?}
    Step1 -- No --> FailTampered[Result: TAMPERED / INVALID]
    Step1 -- Yes --> Step2{Step 2: Authenticity<br>Verify signature using Institution's Public Key}
    
    Step2 -- Failed --> FailAuthenticity[Result: INVALID SIGNATURE]
    Step2 -- Verified --> Step3{Step 3: Block Integrity<br>Recalculate block hash.<br>Does it match stored blockHash?}
    
    Step3 -- No --> FailChain[Result: TAMPERED LEDGER]
    Step3 -- Yes --> Step4{Step 4: Chain Continuity<br>Traverse back to previous blocks.<br>Are all linked block hashes valid?}
    
    Step4 -- Failed --> FailChain
    Step4 -- Success --> Step5{Step 5: Status Check<br>Is credential status ACTIVE?}
    
    Step5 -- Active --> VerSuccess[Result: VERIFIED / AUTHENTIC]
    Step5 -- Revoked --> VerRevoked[Result: REVOKED]
```

### Verification Steps Explanation:

1. **Data Integrity Audit**: Re-serializes the JSON student data deterministically and recalculates its SHA-256 hash. If even one character of the name or degree was altered directly in the database, this recalculation fails.
2. **Signature Verification**: Validates the cryptographic signature using the institution's public key to confirm that the credential was signed by the registered institution and hasn't been altered.
3. **Block Verification**: Recomputes the SHA-256 hash of the corresponding block's properties inside the ledger (`index`, `timestamp`, `credentialId`, `dataHash`, `previousHash`, `signature`) and asserts it matches the database `blockHash`.
4. **Chain Verification**: Verifies the ledger sequence. Starting from the target block, the system crawls backwards, ensuring each block's `previousHash` matches the actual block hash of the preceding record, guaranteeing historical immutability.
5. **Status Verification**: Checks whether the document has been marked as `REVOKED` in the database.
