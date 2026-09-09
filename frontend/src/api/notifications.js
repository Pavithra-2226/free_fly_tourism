import { API_BASE_URL, authHeaders, extractErrorMessage } from "./client.js";

/**
 * Admin: fetches recent notifications (newest first).
 * Returns { success, notifications, message, unauthorized }.
 */
export async function fetchNotifications() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      headers: { ...authHeaders() },
    });
    const data = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 403) {
      return { success: false, notifications: [], message: "Please log in again.", unauthorized: true };
    }

    if (!response.ok) {
      return {
        success: false,
        notifications: [],
        message: extractErrorMessage(data) || "Could not load notifications.",
      };
    }

    return { success: true, notifications: data || [], message: "" };
  } catch (err) {
    return {
      success: false,
      notifications: [],
      message: "Could not reach the server. Please check your connection and try again.",
    };
  }
}

/** Admin: marks one notification as read. Returns { success, message }. */
export async function markNotificationRead(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { ...authHeaders() },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { success: false, message: extractErrorMessage(data) || "Could not update notification." };
    }
    return { success: true, message: "" };
  } catch (err) {
    return {
      success: false,
      message: "Could not reach the server. Please check your connection and try again.",
    };
  }
}
