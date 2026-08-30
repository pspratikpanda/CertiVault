import Credential from '../models/credential.model.js';
import LedgerBlock from '../models/ledgerBlock.model.js';
import User from '../models/user.model.js';
import { calculateHash } from '../crypto/hashing.service.js';
import { verifySignature } from '../crypto/signing.service.js';
import { generateBlockHash, validateChainIntegrity } from './ledger.service.js';

/**
 * Verifies a credential's authenticity and integrity.
 * Performs four checks:
 *   1. Re‑calculate immutable data hash and compare with stored `credentialHash`.
 *   2. Verify RSA signature using the issuing institution's public key.
 *   3. Re‑calculate the ledger block hash and ensure it matches stored `blockHash`.
 *   4. Ensure the ledger chain up to this block is valid (optional full‑chain check).
 *
 * @param {string} credentialId - The credential identifier (e.g., "cred_abcdef").
 * @returns {Promise<Object>} - Verification result object.
 */
export const verifyCredential = async (credentialId) => {
  // 1. Load credential
  const credential = await Credential.findOne({ credentialId });
  if (!credential) {
    return { valid: false, error: 'Credential not found' };
  }

  // 2. Re‑calculate immutable data hash
  const immutableData = {
    credentialId: credential.credentialId,
    studentName: credential.studentName,
    studentId: credential.studentId,
    degree: credential.degree,
    department: credential.department,
    graduationDate: credential.graduationDate?.toISOString?.() ?? credential.graduationDate,
    issueDate: credential.issueDate?.toISOString?.() ?? credential.issueDate,
    institutionId: credential.institutionId.toString(),
  };
  const recalculatedHash = calculateHash(immutableData);
  const hashMatches = recalculatedHash === credential.credentialHash;

  // 3. Verify RSA signature using institution public key
  const institution = await User.findById(credential.institutionId).select('+publicKey');
  const signatureValid = institution && institution.publicKey
    ? verifySignature(institution.publicKey, credential.credentialHash, credential.signature)
    : false;

  // 4. Verify ledger block integrity for this credential
  const ledgerBlock = await LedgerBlock.findOne({ credentialId });
  let blockValid = false;
  let chainValid = false;
  if (ledgerBlock) {
    const expectedBlockHash = generateBlockHash({
      index: ledgerBlock.index,
      timestamp: ledgerBlock.timestamp,
      credentialId: ledgerBlock.credentialId,
      dataHash: ledgerBlock.dataHash,
      previousHash: ledgerBlock.previousHash,
      signature: ledgerBlock.signature,
    });
    blockValid = expectedBlockHash === ledgerBlock.blockHash;
    // Optional full‑chain validation (may be expensive). We run a lightweight check.
    const chainCheck = await validateChainIntegrity();
    chainValid = chainCheck.valid;
  }

  const isRevoked = credential.status === 'REVOKED';

  const overallValid = hashMatches && signatureValid && blockValid && chainValid;

  return {
    valid: overallValid,
    credential,
    hashMatches,
    signatureValid,
    blockValid,
    chainValid,
    revoked: isRevoked,
    errors: {
      hashMismatch: !hashMatches,
      signatureInvalid: !signatureValid,
      blockInvalid: !blockValid,
      chainInvalid: !chainValid,
      revoked: isRevoked,
    },
  };
};
