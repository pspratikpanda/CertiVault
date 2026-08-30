import LedgerBlock from '../models/ledgerBlock.model.js';
import { calculateHash } from '../crypto/hashing.service.js';

/**
 * Retrieves the block with the highest index (the tail of the chain).
 * @returns {Promise<LedgerBlock|null>} - The tail block or null if chain is empty.
 */
export const getTailBlock = async () => {
  return await LedgerBlock.findOne().sort({ index: -1 });
};

/**
 * Calculates the cryptographic hash of a ledger block based on its header and verification attributes.
 * Formula: blockHash = SHA256(index + timestamp + credentialId + dataHash + previousHash + signature)
 * @param {object} block - The block properties
 * @returns {string} - The SHA-256 block hash in hex representation
 */
export const generateBlockHash = (block) => {
  const { index, timestamp, credentialId, dataHash, previousHash, signature } = block;
  
  // Format timestamp consistently to ISO string
  const formattedTimestamp = timestamp instanceof Date 
    ? timestamp.toISOString() 
    : new Date(timestamp).toISOString();

  // Combine elements into a single payload string
  const payload = `${index}${formattedTimestamp}${credentialId}${dataHash}${previousHash}${signature}`;
  
  return calculateHash(payload);
};

/**
 * Validates the entire hash-chain ledger integrity from index 0 to the tail.
 * Verifies block index sequence, previousHash pointers, and individual block hashes.
 * @returns {Promise<{valid: boolean, reason?: string, message?: string}>}
 */
export const validateChainIntegrity = async () => {
  try {
    const blocks = await LedgerBlock.find().sort({ index: 1 });
    
    if (blocks.length === 0) {
      return { valid: true, message: 'Chain is empty.' };
    }

    // 1. Genesis Block Validation (index 0)
    const genesis = blocks[0];
    if (genesis.index !== 0) {
      return { valid: false, reason: `Invalid genesis block index: ${genesis.index}` };
    }

    const genesisExpectedPrevHash = '0'.repeat(64);
    if (genesis.previousHash !== genesisExpectedPrevHash) {
      return { valid: false, reason: 'Invalid genesis block previous hash.' };
    }

    const calculatedGenesisHash = generateBlockHash(genesis);
    if (genesis.blockHash !== calculatedGenesisHash) {
      return { valid: false, reason: 'Genesis block hash is invalid (mismatch).' };
    }

    // 2. Validate chain continuation
    for (let i = 1; i < blocks.length; i++) {
      const current = blocks[i];
      const previous = blocks[i - 1];

      // Assert indices are strictly sequential
      if (current.index !== previous.index + 1) {
        return { 
          valid: false, 
          reason: `Chain index sequence broken between block ${previous.index} and block ${current.index}.` 
        };
      }

      // Assert previousHash pointer matches the previous block's hash
      if (current.previousHash !== previous.blockHash) {
        return { 
          valid: false, 
          reason: `Chain linkage broken at block ${current.index}: previousHash doesn't match block ${previous.index} hash.` 
        };
      }

      // Assert blockHash recalculation matches stored blockHash
      const calculatedHash = generateBlockHash(current);
      if (current.blockHash !== calculatedHash) {
        return { 
          valid: false, 
          reason: `Block hash recalculation mismatch at block index ${current.index}.` 
        };
      }
    }

    return { valid: true, message: 'Ledger integrity verified successfully.' };
  } catch (error) {
    return { valid: false, reason: `Verification error: ${error.message}` };
  }
};
