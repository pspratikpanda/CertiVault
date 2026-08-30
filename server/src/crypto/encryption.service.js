import crypto from 'crypto';
import { config } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits is recommended for GCM
const TAG_LENGTH = 16; // 128 bits auth tag

/**
 * Derives a 32-byte key from the configured DB_ENCRYPTION_KEY using SHA-256.
 * This ensures that whatever key is configured in env is safely converted to exactly 32 bytes.
 * @returns {Buffer} - 32-byte key Buffer
 */
const getSecretKey = () => {
  const secret = config.dbEncryptionKey;
  if (!secret) {
    throw new Error('Database encryption key (DB_ENCRYPTION_KEY) is not configured.');
  }
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns the encrypted payload in the format iv:authTag:ciphertext (all hex encoded).
 * @param {string} text - Plaintext to encrypt
 * @returns {string} - Combined encrypted payload
 */
export const encrypt = (text) => {
  const key = getSecretKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts a payload that was encrypted using the encrypt function.
 * Expects the payload to be in the format iv:authTag:ciphertext.
 * @param {string} encryptedText - Encrypted payload
 * @returns {string} - Decrypted plaintext
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== 'string') {
    throw new Error('Encrypted input must be a non-empty string.');
  }

  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format. Expected iv:authTag:ciphertext');
  }

  const key = getSecretKey();
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const ciphertext = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
