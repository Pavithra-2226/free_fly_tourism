import { API_BASE_URL, clearAdminToken, extractErrorMessage, setAdminToken } from "./client.js";

/**
 * Logs the admin in and stores the returned token (used by every
 * subsequent admin API call via authHeaders() in client.js).
 * Returns { success, message }.
 */
export async function loginAdmin(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, message: extractErrorMessage(data) || "Invalid username or password." };
    }

    setAdminToken(data.access_token);
    return { success: true, message: "" };
  } catch (err) {
    return {
      success: false,
      message: "Could not reach the server. Please check your connection and try again.",
    };
  }
}

export function logoutAdmin() {
  clearAdminToken();
}
