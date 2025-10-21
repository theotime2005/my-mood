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

/**
 * Gets the current user's information
 * @param {string} baseUrl - Base URL of the API
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean, data?: object, message?: string}>}
 */
async function getUserInfo({ baseUrl, token }) {
  try {
    const url = `${baseUrl}/api/user`;
    const response = await fetch(url, {
      method: "GET",
      headers: createHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result.data };
    } else {
      return { success: false, message: "Erreur lors de la récupération des informations" };
    }
  } catch (_error) {
    return { success: false, message: "Erreur de connexion au serveur" };
  }
}

/**
 * Saves a mood entry
 * @param {string} baseUrl - Base URL of the API
 * @param {string} token - Authentication token
 * @param {string} emotionalState - The emotional state
 * @param {number} motivation - The motivation level (1-10)
 * @returns {Promise<{success: boolean, message?: string}>}
 */
async function saveMood({ baseUrl, token, emotionalState, motivation }) {
  try {
    const url = `${baseUrl}/api/moods`;
    const response = await fetch(url, {
      method: "POST",
      headers: createHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({ emotionalState, motivation }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, message: data.message || "Erreur lors de l'enregistrement" };
    }
  } catch (_error) {
    return { success: false, message: "Erreur de connexion au serveur" };
  }
}

export { checkHealth, createHeaders, getUserInfo, login, saveMood };
