/**
 * Single source of truth for the current promotional offer.
 * Update these values whenever the offer changes - nothing else
 * in the codebase needs to be touched.
 *
 * NOTE ON LIVE NUMBERS: totalSeats/regularPrice/earlyBirdPrice/offerEndsAt
 * below are display fallbacks only, used before the backend responds (or if
 * it's briefly unreachable). The real seatsBooked/remaining and the
 * authoritative offer_ends_at always come from GET /api/enquiries/early-bird
 * (see src/api/earlyBird.js) - both the customer page and the admin page
 * render whatever that endpoint returns, never a hardcoded count.
 */

// Fixed deadline - must match backend/app/models.py EARLY_BIRD_OFFER_ENDS_AT
// exactly. This does NOT restart on refresh: it's a fixed point in time, not
// a duration computed from "now".
export const OFFER = {
  destination: "Munnar",
  location: "Munnar, Kerala",
  duration: "2 Days / 1 Night",
  regularPrice: 2999,
  earlyBirdPrice: 2699,
  totalSeats: 7,
  offerEndsAt: "2026-09-10T23:59:59+05:30",
};

export const TRIP_TYPES = ["Family", "Couple", "Friends", "Solo", "Corporate / Group"];

export const TRAVELLER_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1);
