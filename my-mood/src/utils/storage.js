import * as SecureStore from "expo-secure-store";

const BASE_URL_KEY = "my_mood_base_url";
const TOKEN_KEY = "my_mood_token";

/**
 * Saves the base URL of the API
 * @param {string} url - Base URL
 */
async function saveBaseUrl(url) {
  await SecureStore.setItemAsync(BASE_URL_KEY, url);
}

/**
 * Retrieves the base URL of the API
 * @returns {Promise<string|null>}
 */
async function getBaseUrl() {
  return await SecureStore.getItemAsync(BASE_URL_KEY);
}

/**
 * Saves the authentication token
 * @param {string} token - Authentication token
 */
async function saveToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/**
 * Retrieves the authentication token
 * @returns {Promise<string|null>}
 */
async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

/**
 * Deletes the authentication token
 */
async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export { deleteToken, getBaseUrl, getToken, saveBaseUrl, saveToken };
