/**
 * Decodes a JWT token to extract user information
 * Note: This does NOT validate the token signature, it just decodes the payload
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
function decodeToken(token) {
  try {
    if (!token) {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (_error) {
    return null;
  }
}

export { decodeToken };
