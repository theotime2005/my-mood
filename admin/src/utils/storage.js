const LOGIN_STORAGE = "my-mood-login";

/**
 * Save login token to local storage
 * @param {String} token - login token
 */
function saveLogin(token) {
  localStorage.setItem(LOGIN_STORAGE, token);
}

/**
 * Get login token from local storage
 * @returns {string} - login token
 */
function getLogin() {
  return localStorage.getItem(LOGIN_STORAGE);
}

/**
 * Remove login token from local storage
 */
function removeLogin() {
  localStorage.removeItem(LOGIN_STORAGE);
}

export { getLogin, removeLogin, saveLogin };
