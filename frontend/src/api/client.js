export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const TOKEN_STORAGE_KEY = "fft_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function authHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function extractErrorMessage(data) {
  if (!data) return null;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) {
    return data.detail.map((d) => d.msg).join(" ");
  }
  return null;
}
