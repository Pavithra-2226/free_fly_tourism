import { useState } from "react";
import { OFFER, TRAVELLER_COUNTS } from "../config/offer.js";
import { submitEnquiry } from "../api/enquiries.js";

const initialForm = {
  name: "",
  phone: "",
  destination: OFFER.destination,
  travel_date_from: "",
  travel_date_to: "",
  travellers: "",
};

export default function EnquiryForm() {
  const [form, setForm] = useState(initialForm);

  const [status, setStatus] = useState({
    state: "idle",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function handleTravelDateChange(e) {
    const selectedDate = e.target.value;

    if (!selectedDate) {
      setForm((prev) => ({
        ...prev,
        travel_date_from: "",
        travel_date_to: "",
      }));
      return;
    }

    const date = new Date(`${selectedDate}T00:00:00`);

    // Saturday = 6
    if (date.getDay() !== 6) {
      setFieldErrors((prev) => ({
        ...prev,
        travel_date_from: "Please select a Saturday.",
      }));

      setForm((prev) => ({
        ...prev,
        travel_date_from: "",
        travel_date_to: "",
      }));

      return;
    }

    // Automatically set Sunday as the end date.
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() + 1);

    const year = sunday.getFullYear();
    const month = String(sunday.getMonth() + 1).padStart(2, "0");
    const day = String(sunday.getDate()).padStart(2, "0");

    const travelDateTo = `${year}-${month}-${day}`;

    setForm((prev) => ({
      ...prev,
      travel_date_from: selectedDate,
      travel_date_to: travelDateTo,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      travel_date_from: "",
      travel_date_to: "",
    }));
  }

  function validate() {
    const errors = {};

    if (!form.name.trim()) {
      errors.name = "Full name is required.";
    }

    if (!form.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    if (!form.destination.trim()) {
      errors.destination = "Destination is required.";
    }

    if (!form.travel_date_from) {
      errors.travel_date_from = "Please select a Saturday.";
    }

    if (!form.travel_date_to) {
      errors.travel_date_to = "Travel end date is required.";
    }

    if (!form.travellers) {
      errors.travellers = "Please select number of travellers.";
    }

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validate();

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setStatus({
      state: "loading",
      message: "",
    });

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      destination: form.destination,
      travel_date_from: form.travel_date_from,
      travel_date_to: form.travel_date_to,
      travellers: Number(form.travellers),
    };

    const result = await submitEnquiry(payload);

    if (result.success) {
      setStatus({
        state: "success",
        message: result.message,
      });

      setForm(initialForm);
      setFieldErrors({});
    } else {
      setStatus({
        state: "error",
        message: result.message,
      });
    }
  }

  function getNextSaturday() {
    const today = new Date();
    const day = today.getDay();

    let daysUntilSaturday = 6 - day;

    if (daysUntilSaturday < 0) {
      daysUntilSaturday += 7;
    }

    const nextSaturday = new Date(today);

    nextSaturday.setDate(
      today.getDate() + daysUntilSaturday
    );

    const year = nextSaturday.getFullYear();
    const month = String(
      nextSaturday.getMonth() + 1
    ).padStart(2, "0");

    const date = String(
      nextSaturday.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${date}`;
  }

  return (
    <section
      id="enquiry-form"
      className="relative overflow-hidden bg-gradient-to-br from-[#eef9f5] via-white to-[#f5fbf8] py-14 sm:py-20"
    >
      {/* =========================
          BACKGROUND DECORATIONS
      ========================== */}

      {/* Soft decorative circles */}
      <div className="absolute -left-32 top-20 w-80 h-80 rounded-full bg-[#dff3ed]/60 blur-3xl pointer-events-none" />

      <div className="absolute -right-32 bottom-10 w-96 h-96 rounded-full bg-[#dff3ed]/60 blur-3xl pointer-events-none" />

      {/* =========================
          LEFT SIDE DECORATION
      ========================== */}

      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-[270px] xl:w-[320px] pointer-events-none z-0">
        <div className="relative px-8 xl:px-10">

          {/* Leaves */}
          <div className="absolute left-5 top-[-80px] opacity-50">
            <LeafIcon size={95} />
          </div>

          <div className="absolute left-[-10px] bottom-[-100px] opacity-30 rotate-[-20deg]">
            <LeafIcon size={120} />
          </div>

          {/* Text */}
          <div className="relative">
            <p className="font-display italic font-bold text-[#087d76] text-4xl xl:text-5xl leading-[1.15]">
              Your
              <br />
              Munnar
              <br />
              Trip
              <br />
              Awaits!
            </p>
          </div>

          {/* Dotted flight path */}
          <div className="mt-8 ml-3">
            <svg
              width="230"
              height="125"
              viewBox="0 0 230 125"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 90C48 123 75 72 108 82C145 93 158 37 220 10"
                stroke="#078c86"
                strokeWidth="2"
                strokeDasharray="8 8"
              />

              <path
                d="M211 8L220 10L216 18"
                stroke="#078c86"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Small plane */}
          <div className="absolute right-5 bottom-4 text-[#087d76] rotate-[-20deg]">
            <SmallPlaneIcon />
          </div>
        </div>
      </div>

      {/* =========================
          RIGHT SIDE PHOTO
      ========================== */}

      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[290px] xl:w-[350px] pointer-events-none z-0">
        <div className="relative flex justify-end pr-5 xl:pr-10">

          {/* Sun */}
          <div className="absolute -top-16 right-16 xl:right-24 text-[#f5aa00]">
            <SunIcon />
          </div>

          {/* Leaves behind photo */}
          <div className="absolute -top-6 right-[-5px] opacity-50">
            <LeafIcon size={100} />
          </div>

          <div className="absolute -bottom-10 right-2 opacity-40 rotate-[-15deg]">
            <LeafIcon size={110} />
          </div>

          {/* Photo frame */}
          <div className="relative w-[215px] xl:w-[255px] rotate-[7deg] bg-white p-4 pb-6 shadow-[0_18px_45px_rgba(0,80,75,0.18)]">
  
  {/* Image */}
  <img
    src="/Neelakurinji.jpg"
    alt="Munnar Kerala"
    className="w-full h-[280px] xl:h-[335px] object-cover"
  />

  {/* Caption */}
  <div className="pt-3 px-1">
    <p className="font-display italic font-extrabold text-2xl xl:text-3xl leading-tight text-[#087f79]">
      Good Vibes
    </p>

    <p className="font-display italic font-extrabold text-2xl xl:text-3xl leading-tight text-[#087f79]">
      Great Views ♥
    </p>
  </div>

</div>
        </div>
      </div>

      {/* =========================
          FORM CONTAINER
      ========================== */}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-[30px] border border-[#d8eeea] shadow-[0_25px_70px_rgba(0,70,70,0.16)] px-5 sm:px-10 md:px-12 py-9 sm:py-11">

          {/* Form Header */}
          <div className="text-center mb-8">

            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[#e2f5f1] flex items-center justify-center text-[#07857e] shadow-sm">
              <PlaneIcon />
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#075f5a]">
              Enquiry Form
            </h2>

            <p className="text-[#547b78] mt-2 text-sm sm:text-base">
              Fill in your details and our team will get back to you shortly.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">

              {/* =========================
                  FULL NAME
              ========================== */}

              <Field
                label="Full Name"
                required
                error={fieldErrors.name}
                icon={<PersonIcon />}
              >
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass(fieldErrors.name)}
                />
              </Field>

              {/* =========================
                  PHONE
              ========================== */}

              <Field
                label="Phone Number"
                required
                error={fieldErrors.phone}
                icon={<PhoneIcon />}
              >
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass(fieldErrors.phone)}
                />
              </Field>

              {/* =========================
                  DESTINATION
              ========================== */}

              <Field
                label="Destination"
                required
                error={fieldErrors.destination}
                icon={<PinIcon />}
              >
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  readOnly
                  className={`${inputClass(
                    fieldErrors.destination
                  )} bg-[#f7fbfa] cursor-not-allowed`}
                />
              </Field>

              {/* =========================
                  TRAVEL DATE
              ========================== */}

              <Field
                label="Travel Date"
                required
                error={fieldErrors.travel_date_from}
                icon={<CalendarIcon />}
              >
                <input
                  type="date"
                  name="travel_date_from"
                  value={form.travel_date_from}
                  min={getNextSaturday()}
                  onChange={handleTravelDateChange}
                  className={inputClass(
                    fieldErrors.travel_date_from
                  )}
                />

                <p className="flex items-center gap-1.5 text-xs text-[#07857e] mt-2">
                  <InfoIcon />
                  Trip runs Saturday to Sunday.
                </p>
              </Field>

              {/* =========================
                  TRAVELLERS
              ========================== */}

              <Field
                label="Number of Travellers"
                required
                error={fieldErrors.travellers}
                icon={<PeopleIcon />}
              >
                <select
                  name="travellers"
                  value={form.travellers}
                  onChange={handleChange}
                  className={inputClass(
                    fieldErrors.travellers
                  )}
                >
                  <option value="">Select</option>

                  {TRAVELLER_COUNTS.map((n) => (
                    <option
                      key={n}
                      value={n}
                    >
                      {n}{" "}
                      {n === 1
                        ? "Traveller"
                        : "Travellers"}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* =========================
                SUBMIT BUTTON
            ========================== */}

            <button
              type="submit"
              disabled={status.state === "loading"}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                bg-gradient-to-r
                from-[#079b87]
                to-[#0879a3]
                hover:from-[#078b7b]
                hover:to-[#066e94]
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                font-bold
                py-4
                rounded-full
                shadow-[0_8px_20px_rgba(0,120,120,0.20)]
                hover:shadow-[0_10px_25px_rgba(0,120,120,0.28)]
                transition-all
                duration-300
              "
            >
              <SendIcon />

              {status.state === "loading"
                ? "Submitting..."
                : "Submit Enquiry"}

              {status.state !== "loading" && (
                <ArrowIcon />
              )}
            </button>

            {/* =========================
                SUCCESS MESSAGE
            ========================== */}

            {status.state === "success" && (
              <p className="text-center text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl py-3 px-4">
                {status.message}
              </p>
            )}

            {/* =========================
                ERROR MESSAGE
            ========================== */}

            {status.state === "error" && (
              <p className="text-center text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl py-3 px-4">
                {status.message}
              </p>
            )}

            {/* =========================
                FOOTER NOTE
            ========================== */}

            {status.state !== "success" &&
              status.state !== "error" && (
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#6f9793]">
                  <LockIcon />
                  We will get back to you as soon as possible.
                </p>
              )}
          </form>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FIELD COMPONENT
========================================================= */

function Field({
  label,
  required,
  error,
  icon,
  children,
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-bold text-[#075f5a]">
        <span className="text-[#07857e]">
          {icon}
        </span>

        {label}

        {required && (
          <span className="text-red-500">*</span>
        )}
      </span>

      <div className="mt-2">
        {children}
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1.5 block">
          {error}
        </span>
      )}
    </label>
  );
}

/* =========================================================
   INPUT STYLE
========================================================= */

function inputClass(error) {
  return [
    "w-full rounded-xl border px-4 py-3 text-sm text-[#315e5b]",
    "bg-white placeholder:text-[#9ab2af]",
    "transition-all duration-200",
    "focus:outline-none",
    "focus:ring-2 focus:ring-[#079b87]/20",
    "focus:border-[#079b87]",
    error
      ? "border-red-400"
      : "border-[#cce3df]",
  ].join(" ");
}

/* =========================================================
   ICONS
========================================================= */

function PlaneIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-3 2v1.5l4.5-1 4.5 1V21l-3-2v-5.5Z" />
    </svg>
  );
}

function SmallPlaneIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-3 2v1.5l4.5-1 4.5 1V21l-3-2v-5.5Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.56 3.57.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.61 21 3 12.39 3 2.99a1 1 0 0 1 1-1H7.5a1 1 0 0 1 1 1c0 1.25.19 2.45.56 3.57a1 1 0 0 1-.25 1.02l-2.19 2.21Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4V6Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="55"
      height="55"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function LeafIcon({ size = 80 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M75 10C55 13 34 27 27 46c-5 14 1 28 14 32 18 5 34-8 39-25 4-13 1-28-5-43Z"
        fill="#b9e4d8"
      />

      <path
        d="M28 78C40 57 52 39 75 11"
        stroke="#78c9b8"
        strokeWidth="2"
      />

      <path
        d="M44 55c8-1 15 1 21 5M51 43c7-1 12 0 18 3"
        stroke="#78c9b8"
        strokeWidth="1.5"
      />
    </svg>
  );
}