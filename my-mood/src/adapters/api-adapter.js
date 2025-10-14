/**
 * Vérifie la santé de l'API
 * @param {string} baseUrl - URL de base de l'API
 * @returns {Promise<boolean>} - true si l'API est accessible, false sinon
 */
async function checkHealth(baseUrl) {
  try {
    const url = `${baseUrl}/api/health`;
    const response = await fetch(url, {
      method: "GET",
    });

    return response.ok;
  } catch (_error) {
    return false;
  }
}

/**
 * Authentifie un utilisateur
 * @param {string} baseUrl - URL de base de l'API
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<{success: boolean, token?: string, message?: string}>}
 */
async function login({ baseUrl, email, password }) {
  try {
    const url = `${baseUrl}/api/authentication/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

export { checkHealth, login };
