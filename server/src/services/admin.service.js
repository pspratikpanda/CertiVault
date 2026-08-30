import Credential from '../models/credential.model.js';
import LedgerBlock from '../models/ledgerBlock.model.js';

/**
 * Directly modifies a credential to simulate tampering.
 * For demo purposes we simply change the studentName field.
 * In a real system this would be restricted to privileged admins.
 */
export const tamperCredential = async (credentialId) => {
  const cred = await Credential.findOne({ credentialId });
  if (!cred) {
    throw new Error('Credential not found');
  }
  // Simple tamper: modify a mutable field
  cred.studentName = 'Tampered';
  await cred.save();
  return cred;
};

/**
 * Retrieves raw database collections (Credentials and LedgerBlocks) for demonstration and auditing playground.
 */
export const getPlaygroundData = async () => {
  const credentials = await Credential.find({}).sort({ createdAt: -1 }).lean();
  const ledgerBlocks = await LedgerBlock.find({}).sort({ index: 1 }).lean();
  return { credentials, ledgerBlocks };
};
