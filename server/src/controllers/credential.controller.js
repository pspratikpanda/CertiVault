import crypto from 'crypto';
import Credential from '../models/credential.model.js';
import LedgerBlock from '../models/ledgerBlock.model.js';
import User from '../models/user.model.js';
import { calculateHash } from '../crypto/hashing.service.js';
import { decrypt } from '../crypto/encryption.service.js';
import { signData } from '../crypto/signing.service.js';
import { getTailBlock, generateBlockHash } from '../services/ledger.service.js';
import { config } from '../config/env.js';
import { apiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';
import { verifyCredential } from '../services/verification.service.js';
/**
 * Issues a new academic credential:
 * Calculates cryptographic signature, appends a block to the ledger, and stores the credential.
 */
export const issueCredential = asyncHandler(async (req, res) => {
  const { studentName, studentId, degree, department, graduationDate } = req.body;

  // 1. Validation
  if (!studentName || typeof studentName !== 'string' || !studentName.trim()) {
    throw apiError(400, 'VALIDATION_ERROR', 'Student name is required.');
  }
  if (!studentId || typeof studentId !== 'string' || !studentId.trim()) {
    throw apiError(400, 'VALIDATION_ERROR', 'Student ID is required.');
  }
  if (!degree || typeof degree !== 'string' || !degree.trim()) {
    throw apiError(400, 'VALIDATION_ERROR', 'Degree is required.');
  }
  if (!department || typeof department !== 'string' || !department.trim()) {
    throw apiError(400, 'VALIDATION_ERROR', 'Department is required.');
  }
  if (!graduationDate || isNaN(Date.parse(graduationDate))) {
    throw apiError(400, 'VALIDATION_ERROR', 'A valid graduation date is required.');
  }

  // 2. Fetch institution user including the private key
  const institution = await User.findById(req.user._id).select('+privateKey');
  if (!institution || !institution.privateKey) {
    throw apiError(500, 'SIGNING_KEY_ERROR', 'Institution signing key is missing or not configured.');
  }

  // 3. Generate credential ID
  const credentialId = 'cred_' + crypto.randomBytes(4).toString('hex');

  // 4. Assemble canonical immutable data
  const immutableData = {
    credentialId,
    studentName: studentName.trim(),
    studentId: studentId.trim(),
    degree: degree.trim(),
    department: department.trim(),
    graduationDate: new Date(graduationDate).toISOString(),
    issueDate: new Date().toISOString(),
    institutionId: institution._id.toString(),
  };

  // 5. Hash and sign
  const credentialHash = calculateHash(immutableData);
  const decryptedPrivateKey = decrypt(institution.privateKey);
  const signature = signData(decryptedPrivateKey, credentialHash);

  // 6. Fetch chain tail and calculate ledger variables
  const tailBlock = await getTailBlock();
  const nextIndex = tailBlock ? tailBlock.index + 1 : 0;
  const previousHash = tailBlock ? tailBlock.blockHash : '0'.repeat(64);

  // 7. Create ledger block
  const blockData = {
    index: nextIndex,
    timestamp: new Date(),
    credentialId,
    dataHash: credentialHash,
    previousHash,
    signature,
  };
  const blockHash = generateBlockHash(blockData);
  const ledgerBlock = await LedgerBlock.create({ ...blockData, blockHash });

  // 8. Create credential record
  const credential = await Credential.create({
    ...immutableData,
    credentialHash,
    signature,
    keyId: 'key_2026_01', // Standard identifier matching the API plan
    status: 'ACTIVE',
  });

  const verificationUrl = `${config.frontendUrl}/verify/${credentialId}`;

  res.status(201).json({
    success: true,
    data: {
      credential,
      ledgerBlock,
      verificationUrl,
    },
  });
});

/**
 * Revokes an existing credential:
 * Checks ownership, flags credential status as REVOKED, and records revocation metadata.
 */
export const revokeCredential = asyncHandler(async (req, res) => {
  const { id } = req.params; // credentialId
  const { reason } = req.body;

  const credential = await Credential.findOne({ credentialId: id });
  if (!credential) {
    throw apiError(404, 'CREDENTIAL_NOT_FOUND', 'Credential not found.');
  }

  // Ensure only the issuing institution can revoke it
  if (credential.institutionId.toString() !== req.user._id.toString()) {
    throw apiError(403, 'UNAUTHORIZED_REVOCATION', 'You are not authorized to revoke this credential.');
  }

  if (credential.status === 'REVOKED') {
    throw apiError(400, 'CREDENTIAL_ALREADY_REVOKED', 'This credential has already been revoked.');
  }

  credential.status = 'REVOKED';
  credential.revokedAt = new Date();
  credential.revokedBy = req.user._id.toString();
  credential.revocationReason = reason || 'No reason provided';
  await credential.save();

  res.status(200).json({
    success: true,
    data: {
      credentialId: credential.credentialId,
      status: credential.status,
      revokedAt: credential.revokedAt,
      revokedBy: credential.revokedBy,
      revocationReason: credential.revocationReason,
    },
  });
});

/**
 * Lists all credentials issued by the authenticated institution.
 */
export const listCredentials = asyncHandler(async (req, res) => {
  const credentials = await Credential.find({ institutionId: req.user._id }).sort({ issueDate: -1 });
  
  res.status(200).json({
    success: true,
    data: {
      credentials,
    },
  });
});

/**
 * Public verification endpoint (no auth).
 * Returns detailed verification info for a given credential ID.
 */
export const verifyPublicCredential = asyncHandler(async (req, res) => {
  const { id } = req.params; // credentialId
  const result = await verifyCredential(id);

  if (!result.credential) {
    return res.status(404).json({ success: false, error: 'Credential not found' });
  }

  const { valid, revoked, errors, credential } = result;
  res.json({
    success: true,
    data: { valid, revoked, errors, credential },
  });
});
