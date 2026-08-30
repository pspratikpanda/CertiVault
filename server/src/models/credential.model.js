import mongoose from 'mongoose';

/**
 * @file credential.model.js
 * @description Defines the database schema for academic credentials, separating immutable fields from mutable status metadata.
 * @layer Server Model
 */
const credentialSchema = new mongoose.Schema(
  {
    // Immutable Issuance Data
    credentialId: {
      type: String,
      required: true,
      unique: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    graduationDate: {
      type: Date,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    institutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Cryptographic Verification Data
    credentialHash: {
      type: String,
      required: true,
      unique: true,
    },
    signature: {
      type: String,
      required: true,
    },
    keyId: {
      type: String,
      required: true,
    },

    // Mutable Status Metadata (Excluded from Hash-chain integrity check)
    status: {
      type: String,
      enum: ['ACTIVE', 'REVOKED'],
      default: 'ACTIVE',
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedBy: {
      type: String,
      default: null,
    },
    revocationReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Credential', credentialSchema);
