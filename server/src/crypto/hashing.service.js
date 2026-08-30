import crypto from 'crypto';

/**
 * Deterministically serialize a Javascript value to a JSON string by sorting keys.
 * This is crucial for obtaining consistent cryptographic hashes from the same input object.
 * @param {*} val - Any value to serialize
 * @returns {string} - Deterministic JSON string
 */
export const canonicalize = (val) => {
  if (val === null) return 'null';
  if (val === undefined) return 'null'; // normalize undefined to null for consistency
  
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return '[' + val.map(canonicalize).join(',') + ']';
    }
    if (val instanceof Date) {
      return JSON.stringify(val.toISOString());
    }
    // Sort keys alphabetically
    const keys = Object.keys(val).sort();
    const parts = keys.map((key) => {
      const canonicalValue = canonicalize(val[key]);
      return `"${key}":${canonicalValue}`;
    });
    return '{' + parts.join(',') + '}';
  }
  
  // For primitive types (string, number, boolean)
  return JSON.stringify(val);
};

/**
 * Computes the SHA-256 hash of a given string or object.
 * If data is an object, it is first canonicalized.
 * @param {string|object} data - Data to hash
 * @returns {string} - SHA-256 hash in hex representation
 */
export const calculateHash = (data) => {
  const content = typeof data === 'string' ? data : canonicalize(data);
  return crypto.createHash('sha256').update(content).digest('hex');
};
