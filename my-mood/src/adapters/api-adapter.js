const SOURCE = "mymood";

/**
 * Creates headers with the source origin
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object with source and any additional headers
 */
function createHeaders(additionalHeaders = {}) {
  return {
    from: SOURCE,
    ...additionalHeaders,
  };
}

/**
 * Checks the health of the API
 * @param {string} baseUrl - Base URL of the API
 * @returns {Promise<boolean>} - true if the API is accessible, false otherwise
 */
async function checkHealth(baseUrl) {
  try {
    const url = `${baseUrl}/api/health`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders(),
    });

    return response.ok;
  } catch (_error) {
    return false;
  }
}

/**
 * Authenticates a user
 * @param {string} baseUrl - Base URL of the API
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, token?: string, message?: string}>}
 */
async function login({ baseUrl, email, password }) {
  try {
    const url = `${baseUrl}/api/authentication/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: createHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, token: data.token };
    } else {
      return { success: false, message: data.message || "Erreur d'authentification" };
    }
  } catch (_error) {
    return { success: false, message: "Erreur de connexion au serveur" };
  }
}

export { checkHealth, createHeaders, login };
