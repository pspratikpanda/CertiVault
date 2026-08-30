import crypto from 'crypto';

/**
 * Generates a new RSA-2048 key pair.
 * Returns the public and private keys in PEM format.
 * @returns {Promise<{publicKey: string, privateKey: string}>}
 */
export const generateKeyPair = () => {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          return reject(err);
        }
        resolve({ publicKey, privateKey });
      }
    );
  });
};
