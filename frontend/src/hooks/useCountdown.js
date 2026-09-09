import { useEffect, useState } from "react";

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

function getTimeRemaining(endTime) {
  // Accepts a Date or an ISO string (e.g. the fixed offerEndsAt from
  // src/config/offer.js, or offer_ends_at from the backend) - either way
  // this is always measured against the same fixed point in time, so a
  // page refresh never resets the countdown.
  const endDate = endTime instanceof Date ? endTime : new Date(endTime);
  const total = endDate.getTime() - Date.now();

  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    total,
    days: Math.floor(total / MS_IN_DAY),
    hours: Math.floor((total % MS_IN_DAY) / MS_IN_HOUR),
    minutes: Math.floor((total % MS_IN_HOUR) / MS_IN_MINUTE),
    seconds: Math.floor((total % MS_IN_MINUTE) / MS_IN_SECOND),
    expired: false,
  };
}

/**
 * Ticks down to `endTime` every second.
 * Pass a JS Date (see src/config/offer.js) - change the end time in one
 * place and this hook keeps working with no other changes needed.
 */
export function useCountdown(endTime) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
}
