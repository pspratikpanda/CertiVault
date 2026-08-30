import crypto from 'crypto';

/**
 * Creates a cryptographic signature for a data hash using an RSA private key.
 * @param {string} privateKeyPem - The PEM-encoded private key.
 * @param {string} dataHash - The SHA-256 hash of the data (hex-encoded).
 * @returns {string} - The signature in hex format.
 */
export const signData = (privateKeyPem, dataHash) => {
  const sign = crypto.createSign('SHA256');
  // Update the sign buffer with the hex-encoded data hash.
  // Note: We hash the dataHash string representation (already a SHA-256 hash hex string).
  // This conforms to HASH_CHAIN.md: signature = Sign(PrivateKey, credentialHash)
  sign.update(dataHash);
  sign.end();
  return sign.sign(privateKeyPem, 'hex');
};

/**
 * Cryptographically verifies a signature against a data hash using an RSA public key.
 * @param {string} publicKeyPem - The PEM-encoded public key.
 * @param {string} dataHash - The SHA-256 hash of the data (hex-encoded).
 * @param {string} signatureHex - The hex-encoded signature to verify.
 * @returns {boolean} - True if signature is valid, false otherwise.
 */
export const verifySignature = (publicKeyPem, dataHash, signatureHex) => {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(dataHash);
    verify.end();
    return verify.verify(publicKeyPem, signatureHex, 'hex');
  } catch (error) {
    // If key format or signature hex is invalid, verify will throw.
    // We treat this as a failed signature verification.
    return false;
  }
};
