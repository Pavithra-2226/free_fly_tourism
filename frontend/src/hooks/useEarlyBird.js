import { useCallback, useEffect, useState } from "react";
import { fetchEarlyBird } from "../api/enquiries.js";

/**
 * Live Early Bird availability, sourced from GET /api/enquiries/early-bird.
 * Used by both the customer landing page and the admin page so neither one
 * ever shows a hardcoded or stale seat count.
 *
 * Polls every 30s so the customer page picks up admin confirmations without
 * a manual refresh; call `refresh()` for an immediate update (e.g. right
 * after the admin changes a status).
 */
export function useEarlyBird({ pollIntervalMs = 30000 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const result = await fetchEarlyBird();
    if (result.success) {
      setData(result.data);
      setError("");
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    if (!pollIntervalMs) return undefined;
    const interval = setInterval(refresh, pollIntervalMs);
    return () => clearInterval(interval);
  }, [refresh, pollIntervalMs]);

  return { earlyBird: data, loading, error, refresh };
}
