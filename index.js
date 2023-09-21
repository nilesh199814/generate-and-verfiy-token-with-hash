const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Secret key for signing the token. Keep this secret!
const secretKey = 'your-secret-key';

function generateTokenWithHash(payload, expiresIn = '1h') {
  // Create a hash of the payload
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');

  // Include the hash in the token payload
  payload.hash = hash;

  // Generate the JWT with the updated payload
  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
}

function verifyTokenWithHash(token) {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    // Extract the hash from the payload
    const { hash, password, ...payloadWithoutHash } = decodedToken;
    const verifyPayload = { password: password };
    // Verify the integrity of the token by recalculating the hash
    const recalculatedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(verifyPayload))
      .digest('hex');

    console.log('recalculatedHash=>', recalculatedHash);
    if (hash === recalculatedHash) {
      // Token is valid, and the data hasn't been tampered with
      return payloadWithoutHash;
    } else {
      // Token has been tampered with
      throw new Error('Invalid token');
    }
  } catch (error) {
    // Token verification failed
    throw new Error('Invalid token');
  }
}

// module.exports = { generateTokenWithHash, verifyTokenWithHash };

const user = {
  password: 'Test@123',
};
const token = generateTokenWithHash(user);
console.log(token);
try {
  const decodedData = verifyTokenWithHash(token);
  console.log('decodedData=>', decodedData);
} catch (error) {
  console.error(error.message);
}
