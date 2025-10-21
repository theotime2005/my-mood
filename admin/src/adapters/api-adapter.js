import { ERRORS } from "@/constants.js";

const SOURCE = "management";
const BASE_URL = "/api/";

/**
 * Return headers with the application origin
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {*&{from: string}} - Headers with the application origin
 */
function getHeaders(additionalHeaders = {}) {
  return {
    from: SOURCE,
    ...additionalHeaders,
  };
}

/**
 * Check if the API is reachable and healthy
 * @returns {Promise<boolean>} - True if the API is healthy, false otherwise
 */
async function checkApiIsOk() {
  try {
    const request = await fetch(`${BASE_URL}health`);
    return request.status === 200;
  } catch {
    return false;
  }
}

/**
 * Login a user with email and password
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Promise<string|any|{error: string}>}
 */
async function loginUser({ email, password }) {
  try {
    const request = await fetch(`${BASE_URL}authentication/login`, {
      method: "POST",
      headers: getHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        email, password,
      }),
    });
    if (request.status === 200) {
      return await request.json();
    } else if (request.status === 401) {
      return { error: ERRORS.INVALID_CREDENTIALS };
    } else {
      return { error: ERRORS.API_ERROR };
    }
  } catch {
    return { error: ERRORS.API_ERROR };
  }
}

async function getAllUsers(token) {
  try {
    const response = await fetch(`${BASE_URL}users`, {
      method: "GET",
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });
    if (response.status === 200) {
      const { data } = await response.json();
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

async function updateUserType({ userId, token, userType }) {
  try {
    const request = await fetch(`${BASE_URL}users/${userId}/user-type`, {
      method: "PUT",
      headers: getHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({ userType }),
    });
    if (request.status === 200) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function getUserInfo(token) {
  try {
    const response = await fetch(`${BASE_URL}user`, {
      method: "GET",
      headers: getHeaders({ Authorization: `Bearer ${token}` }),
    });
    if (response.status === 200) {
      const { data } = await response.json();
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export { checkApiIsOk, getAllUsers, getUserInfo, loginUser, updateUserType };
