# CertiVault Hash-Chain Ledger Design

This document details the layout, data structure, and algorithms of the simplified, single-node hash-chain ledger used in CertiVault.

---

## 1. Concept: Single-Node Tamper-Evident Ledger

Instead of running a heavy decentralized blockchain consensus network (like smart contracts, P2P communication, mining/staking), CertiVault uses a simplified **blockchain-inspired tamper-evident ledger** stored in MongoDB.
- All blocks are linked sequentially: each block contains the cryptographic hash of the block before it.
- If data in block $N$ is changed, the hash of block $N$ changes.
- Consequently, the `previousHash` reference in block $N+1$ becomes invalid, breaking the entire chain from that point forward.
- The ledger is "tamper-evident", meaning any unauthorized modification is instantly detectable upon verification.

---

## 2. Ledger and Credential Schema

### 2.1. Block Schema
Each block document in the ledger collection follows this layout:

```json
{
  "index": 12,
  "timestamp": "2026-08-25T14:48:00.000Z",
  "credentialId": "cred_82f1b0a5",
  "dataHash": "4a5f82bb1923...",
  "previousHash": "3f82aa9c01bf...",
  "signature": "81abdf7201c...",
  "blockHash": "cd9a83eb102..."
}
```

- **`index`**: Integer identifier of the block (Genesis block = 0).
- **`timestamp`**: Time of block inclusion.
- **`credentialId`**: Reference string linking the block to the specific document in the credentials collection.
- **`dataHash`**: The SHA-256 hash of the canonical immutable credential data.
- **`previousHash`**: The `blockHash` of block $Index - 1$. For index 0, this is a string of 64 zeroes.
- **`signature`**: Cryptographic digital signature of `dataHash`.
- **`blockHash`**: SHA-256 hash of all block contents combined.

### 2.2. Standardized Academic Credential Schema
To ensure integrity, we segregate credential properties into immutable data and status metadata.

#### Immutable Issuance Data (Cryptographically Signed & Hashed)
- `studentName`
- `studentId`
- `degree`
- `department`
- `graduationDate`
- `issueDate`
- `institutionId`

#### Current Status Metadata (Mutable status, excluded from Hash calculations)
- `status` (ACTIVE | REVOKED)
- `revokedAt` (null | Date)
- `revokedBy` (null | String)
- `revocationReason` (null | String)

#### Verification Data
- `credentialHash`
- `signature`
- `keyId`

---

## 3. Cryptographic Functions

### 3.1. Credential Hash Calculation
The credentialHash MUST be computed only from the canonical immutable issuance data. Mutable status/revocation fields MUST NOT participate in credentialHash.

To generate `credentialHash` (which corresponds to `dataHash` in the block), the server canonicalizes (e.g. deterministic JSON string representation) the **Immutable Issuance Data** and hashes it:

$$\text{credentialHash} = \text{SHA256}(\text{CanonicalImmutableData})$$

### 3.2. Block Hash Calculation
The `blockHash` of Block $N$ is computed over its header and verification attributes:

$$\text{blockHash} = \text{SHA256}(\text{index} + \text{timestamp} + \text{credentialId} + \text{dataHash} + \text{previousHash} + \text{signature})$$

### 3.3. Digital Signature Terminology
Signatures are created and verified as follows:

$$\text{signature} = \text{Sign}(\text{PrivateKey}, \text{credentialHash})$$

$$\text{Verify}(\text{PublicKey}, \text{credentialHash}, \text{signature}) \rightarrow \text{true / false}$$

*Note: Digital signatures are never described as "encrypting a hash with a private key".*

---

## 4. Verification & Tamper Detection Algorithm

To verify a credential $C$ with corresponding block $B$ at index $N$:

### Step 1: Credential Integrity Check
1. Retrieve $C$ from the database.
2. Canonicalize the **Immutable Issuance Data** inside $C$.
3. Compute $\text{currentHash} = \text{SHA256}(\text{CanonicalImmutableData})$.
4. Assert that $\text{currentHash} == C.\text{credentialHash}$ (if false, the credential file has been altered).
5. Assert that $\text{currentHash} == B.\text{dataHash}$ (if false, the ledger is out of sync or modified).

### Step 2: Signature Verification
1. Retrieve the issuing institution's public key from the database.
2. Call $\text{Verify}(C.\text{keyId}, \text{currentHash}, C.\text{signature})$ (if false, the signature is invalid or forged).

### Step 3: Block Hash & Chain Continuity Verification
1. Recalculate block hash:
   $$\text{recalculatedHash} = \text{SHA256}(B.\text{index} + B.\text{timestamp} + B.\text{credentialId} + B.\text{dataHash} + B.\text{previousHash} + B.\text{signature})$$
2. Assert that $B.\text{blockHash} == \text{recalculatedHash}$ (if false, block headers have been modified).
3. Fetch Block $N-1$ from the database.
4. Assert that $B.\text{previousHash} == \text{Block}[N-1].\text{blockHash}$ (if false, the chain linkage is broken).

### Step 4: Status Evaluation
If any cryptographic check in Steps 1, 2, or 3 fails:
- Result $\rightarrow$ **TAMPERED/INVALID**

If all cryptographic checks pass:
- Check $C.\text{status}$:
  - If $C.\text{status} == \text{"ACTIVE"}$ $\rightarrow$ **VERIFIED**
  - If $C.\text{status} == \text{"REVOKED"}$ $\rightarrow$ **REVOKED** (the cryptographic details are historically valid, but the status is deactivated).

---

## 5. Tamper Demonstration Flow

The system demonstrability operates as:
1. **Normal Flow**: Issue credential $\rightarrow$ verification succeeds (**VERIFIED**).
2. **Malicious Hack Flow**: An attacker edits a field (e.g. changing `degree` from `"Bachelor of Science"` to `"Doctor of Philosophy"` directly in the credential document).
3. **Verification Failure**:
   - The verification script runs.
   - It recalculates the hash over the modified immutable data: $\text{SHA256}(C_{modified}) \ne C.\text{credentialHash}$.
   - The system alerts that the credential has been **TAMPERED/INVALID**.
