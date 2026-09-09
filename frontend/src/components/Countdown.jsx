import { useCountdown } from "../hooks/useCountdown.js";

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function Countdown({ endTime }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(endTime);

  if (expired) {
    return (
      <div className="bg-white rounded-2xl shadow-lg px-5 py-6 text-center">
        <p className="text-lg font-display font-bold text-red-600">
          Early Bird Offer Expired
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Please contact us for the latest Munnar packages.
        </p>
      </div>
    );
  }

  const units = [
    { label: "Day", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg px-4 sm:px-5 py-5">
      <p className="flex items-center justify-center gap-2 text-brand-navy font-semibold text-sm mb-3">
        <ClockIcon />
        OFFER ENDS IN
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="bg-slate-50 rounded-xl py-2.5 text-center border border-slate-100"
          >
            <p className="font-display font-extrabold text-xl sm:text-2xl text-brand-navy tabular-nums">
              {pad(unit.value)}
            </p>
            <p className="text-[10px] sm:text-xs tracking-wide text-slate-500 uppercase">
              {unit.label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] sm:text-xs text-slate-500 mt-3">
        Limited time Early Bird offer
      </p>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 10.41 4.29 4.3-1.42 1.41L11 13V6h2Z" />
    </svg>
  );
}
