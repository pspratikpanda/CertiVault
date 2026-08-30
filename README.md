# CertiVault — Tamper-Proof Digital Certificate System

CertiVault is a modern, blockchain-inspired academic credential verification system. It allows educational institutions to issue digitally signed, tamper-proof certificates, while enabling employers and verifiers to instantly validate their authenticity via QR codes or verification URLs—bypassing manually processed verification delays.

---

## 🌟 Key Features

* **Cryptographic Signatures**: Certificates are cryptographically signed using **RSA-2048** keypairs to verify the issuing institution's authenticity.
* **Secured Keys at Rest**: Institutional private keys are symmetrically encrypted using **AES-256-GCM** with a server-side encryption key (`DB_ENCRYPTION_KEY`), keeping them secure against database compromises.
* **Tamper-Evident Ledger**: A single-node hash-chain ledger built on MongoDB. Any manual modification to a certificate's database record or a ledger block instantly invalidates the chain hash, which is detected during verification.
* **Public Verification Portal**: Instant public validation via unique ID lookup or directly scanning generated QR codes.
* **Interactive Tampering Demonstration**: A built-in database playground allowing administrators to simulate database-level tampering (e.g. altering student records directly in MongoDB) and watch the validation engine catch the hack in real time.
* **Deployment Ready**: Fully configured CORS settings for multi-origin setup, cross-domain HttpOnly session cookies, and a unified production compilation script.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Tailwind CSS
* **Backend**: Node.js, Express, Mongoose
* **Database**: MongoDB (Local or Atlas Cloud)
* **Cryptographic Engine**: Node.js Native `crypto` module (RSA-2048, AES-256-GCM, SHA-256)

---

## 🚀 Getting Started

### 1. Environment Configuration

Create a `.env` file in your `server/` directory (you can use `server/.env.example` as a template):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-session-jwt-secret-key
DB_ENCRYPTION_KEY=your-32-character-encryption-key
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in your `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Install & Run (Development)

Run the following commands in the root directory:

```bash
# Install dependencies for both server and client
npm run install:all

# Run both backend server and client in development mode
npm run dev
```

### 3. Build & Run (Production)

To compile the production bundles and launch the unified server hosting both the static assets and the API:

```bash
# Build the React production client and install production server dependencies
npm run build

# Start the unified backend server
npm start
```

---

## 📚 Technical Documentation

Explore the structural details, cryptography, and logic behind CertiVault:

* **[Architecture & Layering](file:///docs/ARCHITECTURE.md)** — Architectural design patterns, layer rules, and component roles.
* **[Data Flow Diagram](file:///docs/flow.md)** — Sequence flows explaining user registration, credential issuance, and the 5-step verification process.
* **[Cryptographic Ledger Design](file:///docs/HASH_CHAIN.md)** — Detail on the tamper-evident hash-chain linkage and verification checks.
* **[API Configuration Guide](file:///docs/file-guides/config_files.md)** — Environment parameters, schemas, and configurations.
* **[Security Architecture](file:///docs/SECURITY.md)** — Session design, inputs/outputs sanitation, and threat models.
