import * as SecureStore from "expo-secure-store";

const BASE_URL_KEY = "my_mood_base_url";
const TOKEN_KEY = "my_mood_token";

/**
 * Sauvegarde l'URL de base de l'API
 * @param {string} url - URL de base
 */
async function saveBaseUrl(url) {
  await SecureStore.setItemAsync(BASE_URL_KEY, url);
}

/**
 * Récupère l'URL de base de l'API
 * @returns {Promise<string|null>}
 */
async function getBaseUrl() {
  return await SecureStore.getItemAsync(BASE_URL_KEY);
}

/**
 * Sauvegarde le token d'authentification
 * @param {string} token - Token d'authentification
 */
async function saveToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Récupère le token d'authentification
 * @returns {Promise<string|null>}
 */
async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Supprime le token d'authentification
 */
async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export { deleteToken, getBaseUrl, getToken, saveBaseUrl, saveToken };
