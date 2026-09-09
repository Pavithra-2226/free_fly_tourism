import { OFFER } from "../config/offer.js";
import { useEarlyBird } from "../hooks/useEarlyBird.js";
import Countdown from "./Countdown.jsx";

export default function Hero() {
  const { earlyBird } = useEarlyBird();

  const totalSeats = earlyBird?.total ?? OFFER.totalSeats;
  const remaining = earlyBird?.remaining ?? totalSeats;
  const seatsBooked = totalSeats - remaining;

  const earlyBirdPrice =
    earlyBird?.early_bird_price ?? OFFER.earlyBirdPrice;

  const regularPrice =
    earlyBird?.regular_price ?? OFFER.regularPrice;

  const offerEndsAt =
    earlyBird?.offer_ends_at ?? OFFER.offerEndsAt;

  const soldOut = earlyBird?.sold_out ?? false;

  const savings = Math.max(0, regularPrice - earlyBirdPrice);

  const progress =
    totalSeats > 0
      ? Math.min(100, Math.max(0, (seatsBooked / totalSeats) * 100))
      : 0;

  return (
    <section className="relative overflow-hidden">

      {/* =========================
          Background Image
      ========================== */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1800&auto=format&fit=crop')",
        }}
        aria-hidden="true"
      />

      {/* Warm left gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,250,235,0.98) 0%, rgba(255,250,235,0.91) 32%, rgba(255,250,235,0.58) 55%, rgba(5,65,65,0.08) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#effaf7]/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">

        {/* Nature text */}
        <p className="absolute top-5 right-5 sm:right-12 font-display italic font-bold text-white text-xl sm:text-3xl drop-shadow-lg">
          Nature Awaits...
        </p>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center">

          {/* ==================================================
              LEFT SIDE
          ================================================== */}
          <div className="max-w-2xl">

            {/* Early Bird Badge */}
            <div className="inline-flex items-center gap-2 bg-[#ffc928] text-[#123b3a] font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg -rotate-2">
              <MegaphoneIcon />
              EARLY BIRD OFFER
            </div>

            {/* Small heading */}
            <p className="mt-5 text-lg sm:text-2xl font-display italic font-bold text-[#087f78]">
              Explore the Beauty of
            </p>

            {/* Destination */}
            <h1 className="font-display italic font-black text-6xl sm:text-7xl lg:text-8xl text-[#075b59] leading-[0.9] mt-1 drop-shadow-sm">
              {OFFER.destination}
            </h1>

            {/* Duration + Location */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-[#174f4d]">

              <span className="flex items-center gap-2 font-bold text-base sm:text-lg">
                <CalendarIcon />
                {OFFER.duration}
              </span>

              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#f4513a]" />

              <span className="flex items-center gap-2 font-semibold">
                <PinIcon />
                {OFFER.location}
              </span>

            </div>

            {/* Description */}
            <p className="mt-4 max-w-xl text-sm sm:text-base lg:text-lg text-[#35615f] leading-relaxed">
              Mist-covered hills, scenic views and a perfect getaway
              just for you!
            </p>

            {/* =========================
                PRICE
            ========================== */}
            <div className="flex items-center flex-wrap gap-3 mt-6">

              {/* Old price */}
              <span className="text-lg sm:text-xl font-semibold text-red-500 line-through">
                ₹{regularPrice.toLocaleString("en-IN")}/-
              </span>

              {/* New price */}
              <div className="relative">

                <div className="bg-[#f4513a] text-white font-display font-black text-3xl sm:text-4xl px-6 py-2.5 rounded-2xl shadow-xl">
                  ₹{earlyBirdPrice.toLocaleString("en-IN")}/-
                </div>

                {/* Save bubble */}
                <span className="absolute -right-16 -top-5 hidden sm:flex items-center justify-center w-20 h-14 rounded-full bg-[#158b67] text-white text-xs font-black leading-tight text-center shadow-lg rotate-6">
                  Save
                  <br />
                  ₹{savings}
                </span>

              </div>

            </div>

            {/* =========================
                OFFER + SEATS BADGES
            ========================== */}
            <div className="flex flex-wrap gap-3 mt-5">

              <div className="inline-flex items-center gap-2 bg-[#ffc928] text-[#183d3c] px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md">
                <PeopleIcon />
                FIRST {totalSeats} CONFIRMED BOOKINGS ONLY
              </div>

              {!soldOut && (
                <div className="inline-flex items-center gap-2 bg-[#f4513a] text-white px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md animate-pulse">
                  <FireIcon />

                  {remaining <= 2
                    ? `ONLY ${remaining} SEAT${remaining === 1 ? "" : "S"} LEFT`
                    : `${remaining} EARLY BIRD SLOTS LEFT`}
                </div>
              )}

              {soldOut && (
                <div className="inline-flex items-center gap-2 bg-slate-700 text-white px-5 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-md">
                  Early Bird Sold Out
                </div>
              )}

            </div>

            {/* =========================
                BOOKING PROGRESS CARD
            ========================== */}
            <div className="mt-6 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-5 max-w-xl">

              <div className="flex items-center justify-between gap-5">

                {/* Confirmed */}
                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-2xl bg-[#e0f5f1] text-[#087f78] flex items-center justify-center">
                    <PeopleIcon large />
                  </div>

                  <div>
                    <p className="font-display font-black text-2xl text-[#075b59]">
                      {seatsBooked}/{totalSeats}
                    </p>

                    <p className="text-xs text-slate-500">
                      Confirmed Bookings
                    </p>
                  </div>

                </div>

                <div className="w-px h-12 bg-slate-200" />

                {/* Remaining */}
                <div className="flex items-center gap-3">

                  <div className="w-12 h-12 rounded-2xl bg-[#fff1d5] text-[#e49300] flex items-center justify-center">
                    <TicketIcon />
                  </div>

                  <div>
                    <p className="font-display font-black text-2xl text-[#075b59]">
                      {remaining}
                    </p>

                    <p className="text-xs text-slate-500">
                      {soldOut
                        ? "Early Bird Sold Out"
                        : "Slots Remaining"}
                    </p>
                  </div>

                </div>

              </div>

              {/* Progress */}
              <div className="mt-5">

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
                  <span>Early Bird Availability</span>
                  <span>{Math.round(progress)}% booked</span>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ffc928] via-[#f4513a] to-[#087f78] transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              RIGHT SIDE - COUNTDOWN
          ================================================== */}
          <div className="lg:pt-4">

            <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] p-5 sm:p-7 shadow-2xl border border-white/80">

              {/* Heading */}
              <div className="flex justify-center">

                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f4513a] to-[#ff704d] text-white px-5 py-2.5 rounded-full font-black text-sm shadow-lg">
                  <ClockIcon />
                  OFFER ENDS IN
                </div>

              </div>

              {/* Countdown */}
              <div className="mt-5">
                <Countdown endTime={offerEndsAt} />
              </div>

              {/* Limited offer */}
              <div className="mt-5 flex items-center justify-center gap-2 text-[#087f78] font-semibold text-sm">
                <SparkIcon />
                Limited time Early Bird offer
              </div>

              {/* Urgency */}
              {!soldOut && remaining <= 3 && (
                <div className="mt-5 bg-[#fff4ec] border border-[#ffd3c8] rounded-2xl px-4 py-3 text-center">

                  <p className="text-[#e94732] font-black text-sm">
                    🔥 Hurry! Only {remaining} Early Bird{" "}
                    {remaining === 1 ? "seat" : "seats"} remaining
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Confirm your booking before the offer ends.
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}


/* =========================================================
   ICONS
========================================================= */

function MegaphoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 10v4a1 1 0 0 0 1 1h2l4 4v-4.34l7 2.1V7.24l-7 2.1V5l-4 4H4a1 1 0 0 0-1 1Zm18 2a4 4 0 0 1-2 3.46v-6.92A4 4 0 0 1 21 12Z" />
    </svg>
  );
}


function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 17H5V9h14v10Z" />
    </svg>
  );
}


function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
    </svg>
  );
}


function PeopleIcon({ large = false }) {
  return (
    <svg
      width={large ? "24" : "17"}
      height={large ? "24" : "17"}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
    </svg>
  );
}


function TicketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 13a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3ZM8 7h2v2H8V7Zm0 4h2v2H8v-2Zm0 4h2v2H8v-2Z" />
    </svg>
  );
}


function FireIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 2.5c.2 3-1.1 4.7-2.6 6.2-1.1 1.1-1.8 2.1-1.8 3.5 0 1.5 1.2 2.7 2.7 2.7 2.2 0 3.5-2 3.2-4.5 2.3 1.8 3.5 4.1 3.5 6.5 0 3.6-2.9 6.1-6.6 6.1-4.3 0-7.4-3-7.4-7.4 0-3.4 1.9-6.3 4.5-8.8.1 2.3 1.2 3.5 2.3 4.2.1-2.7 1.4-5.5 2.2-8.5Z" />
    </svg>
  );
}


function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 10.4V7h-2v6l5 3 1-1.7Z" />
    </svg>
  );
}


function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 14 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
    </svg>
  );
}