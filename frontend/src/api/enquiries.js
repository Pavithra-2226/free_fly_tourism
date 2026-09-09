import { API_BASE_URL, authHeaders, extractErrorMessage } from "./client.js";

/**
 * Submits the enquiry form to the FastAPI backend.
 * Returns { success, message } on both success and handled failure,
 * so the UI can always show a clean message without try/catch everywhere.
 * A 409 (duplicate confirmed booking) surfaces the backend's own message.
 */
export async function submitEnquiry(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = extractErrorMessage(data) || "Something went wrong. Please try again.";
      return { success: false, message: errorMessage };
    }

    return {
      success: true,
      message: data?.message || "Thank you! Your enquiry has been submitted.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Could not reach the server. Please check your connection and try again.",
    };
  }
}

/**
 * Public: fetches the live Early Bird availability + pricing.
 * Used by both the customer landing page and the admin page, so the
 * numbers shown in both places always come from the same source.
 * Returns { success, data, message }.
 */
export async function fetchEarlyBird() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enquiries/early-bird`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: extractErrorMessage(data) || "Could not load offer availability.",
      };
    }

    return { success: true, data, message: "" };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: "Could not reach the server. Please check your connection and try again.",
    };
  }
}

/**
 * Admin: fetches every enquiry plus the current Early Bird availability.
 * Requires a valid admin session. Returns { success, enquiries, earlyBird,
 * message, unauthorized } - `unauthorized` is set on a 401/403 so the page
 * can redirect to login.
 */
export async function fetchEnquiries() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
      headers: { ...authHeaders() },
    });
    const data = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        enquiries: [],
        earlyBird: null,
        message: extractErrorMessage(data) || "Please log in again.",
        unauthorized: true,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        enquiries: [],
        earlyBird: null,
        message: extractErrorMessage(data) || "Could not load enquiries.",
      };
    }

    return {
      success: true,
      enquiries: data?.enquiries || [],
      earlyBird: data?.early_bird || null,
      message: "",
    };
  } catch (err) {
    return {
      success: false,
      enquiries: [],
      earlyBird: null,
      message: "Could not reach the server. Please check your connection and try again.",
    };
  }
}

/**
 * Admin: updates one enquiry's status via PATCH /api/enquiries/{id}.
 * Returns { success, enquiry, message, unauthorized }.
 */
export async function updateEnquiryStatus(id, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    });
    const data = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        enquiry: null,
        message: extractErrorMessage(data) || "Please log in again.",
        unauthorized: true,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        enquiry: null,
        message: extractErrorMessage(data) || "Could not update status.",
      };
    }

    return { success: true, enquiry: data, message: "Status updated." };
  } catch (err) {
    return {
      success: false,
      enquiry: null,
      message: "Could not reach the server. Please check your connection and try again.",
    };
  }
}
/**
 * Admin: permanently deletes one enquiry.
 * Requires a valid admin JWT.
 */
export async function deleteEnquiry(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/enquiries/${id}`,
      {
        method: "DELETE",
        headers: {
          ...authHeaders(),
        },
      }
    );

    const data = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message:
          extractErrorMessage(data) ||
          "Please log in again.",
        unauthorized: true,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message:
          extractErrorMessage(data) ||
          "Could not delete enquiry.",
      };
    }

    return {
      success: true,
      message:
        data?.message ||
        "Enquiry deleted successfully.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        "Could not reach the server. Please check your connection and try again.",
    };
  }
}