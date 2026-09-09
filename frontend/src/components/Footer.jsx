export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">

        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <PlaneBadge />

          <div className="leading-tight text-center sm:text-left">
            <p className="font-display font-bold">
              Free Fly &amp; Tourism
            </p>

            <p className="text-xs text-white/70">
              Your Journey, Our Responsibility
            </p>
          </div>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-white/85">

          {/* WhatsApp Numbers */}
          <div className="flex flex-col items-center sm:items-start gap-2">

            <a
              href="https://wa.me/918825668075"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <WhatsAppIcon />
              <span>+91 8825668075</span>
            </a>

            <a
              href="https://wa.me/917904640097"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <WhatsAppIcon />
              <span>+91 7904640097</span>
            </a>

          </div>

          {/* Email */}
          <a
            href="mailto:Freeflytourismandtravels@gmail.com"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <MailIcon />
            <span>Freeflytourismandtravels@gmail.com</span>
          </a>

        </div>

        {/* Social Media */}
        <div className="flex items-center gap-3">

          <SocialIcon href="#" label="Facebook">
            <FacebookIcon />
          </SocialIcon>

          <SocialIcon href="#" label="Instagram">
            <InstagramIcon />
          </SocialIcon>

          <SocialIcon href="#" label="YouTube">
            <YouTubeIcon />
          </SocialIcon>

        </div>

      </div>
    </footer>
  );
}


/* =========================
   Social Icon Wrapper
========================= */

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
    >
      {children}
    </a>
  );
}


/* =========================
   Plane Icon
========================= */

function PlaneBadge() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-3 2v1.5l4.5-1 4.5 1V21l-3-2v-5.5Z" />
    </svg>
  );
}


/* =========================
   WhatsApp Icon
========================= */

function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Z" />
    </svg>
  );
}


/* =========================
   Mail Icon
========================= */

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5Z" />
    </svg>
  );
}


/* =========================
   Facebook Icon
========================= */

function FacebookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H17V3.7C16.7 3.65 15.68 3.5 14.5 3.5c-2.4 0-4 1.46-4 4.15V10H7.8v3.1h2.7V21Z" />
    </svg>
  );
}


/* =========================
   Instagram Icon
========================= */

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M12 2c2.7 0 3 0 4.1.06 1.1.05 1.8.22 2.5.47.7.27 1.24.63 1.8 1.19.56.56.92 1.1 1.19 1.8.25.7.42 1.4.47 2.5.06 1.1.06 1.4.06 4.1s0 3-.06 4.1c-.05 1.1-.22 1.8-.47 2.5a5 5 0 0 1-1.19 1.8c-.56.56-1.1.92-1.8 1.19-.7.25-1.4.42-2.5.47-1.1.06-1.4.06-4.1.06s-3 0-4.1-.06c-1.1-.05-1.8-.22-2.5-.47a5 5 0 0 1-1.8-1.19 5 5 0 0 1-1.19-1.8c-.25-.7-.42-1.4-.47-2.5C2 15 2 14.7 2 12s0-3 .06-4.1c.05-1.1.22-1.8.47-2.5.27-.7.63-1.24 1.19-1.8A5 5 0 0 1 5.5 1.6c.7-.25 1.4-.42 2.5-.47C9.1 1.07 9.4 1 12 1Zm0 4.4A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.8-11.1a1.54 1.54 0 1 1-1.54-1.54 1.54 1.54 0 0 1 1.54 1.54Z" />
    </svg>
  );
}


/* =========================
   YouTube Icon
========================= */

function YouTubeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M23 12s0-3.5-.45-5.2a2.9 2.9 0 0 0-2-2C18.9 4.3 12 4.3 12 4.3s-6.9 0-8.55.5a2.9 2.9 0 0 0-2 2C1 8.5 1 12 1 12s0 3.5.45 5.2a2.9 2.9 0 0 0 2 2c1.65.5 8.55.5 8.55.5s6.9 0 8.55-.5a2.9 2.9 0 0 0 2-2C23 15.5 23 12 23 12ZM9.7 15.5V8.5L15.8 12Z" />
    </svg>
  );
}