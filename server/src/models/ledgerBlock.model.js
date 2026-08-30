import mongoose from 'mongoose';

/**
 * @file ledgerBlock.model.js
 * @description Defines the schema for blocks in the single-node tamper-evident hash-chain ledger.
 * @layer Server Model
 */
const ledgerBlockSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
      unique: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    credentialId: {
      type: String,
      required: true,
    },
    dataHash: {
      type: String,
      required: true,
    },
    previousHash: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    blockHash: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('LedgerBlock', ledgerBlockSchema);
