export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        
        {/* Logo */}
        <div className="flex items-center">
           <img
            src="/logo.jpeg"
            alt="Free Fly & Tourism"
            className="h-12 w-auto object-contain"
          />


          <div className="leading-tight">
            <p className="font-display font-bold text-brand-navy text-base sm:text-lg">
              Free Fly &amp; Tourism
            </p>

            <p className="text-[11px] sm:text-xs text-slate-500">
              Your Journey, Our Responsibility
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* WhatsApp Numbers */}
          <div className="hidden sm:flex items-center gap-4">
            
            <a
              href="https://wa.me/918825668075"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-brand-navy font-medium text-sm hover:text-brand-blue transition-colors"
            >
              <WhatsAppIcon />
              <span>+91 8825668075</span>
            </a>

            <a
              href="https://wa.me/7904640097"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-brand-navy font-medium text-sm hover:text-brand-blue transition-colors"
            >
              <WhatsAppIcon />
              <span>+91 7904640097</span>
            </a>

          </div>

          {/* Enquiry Button */}
          <a
            href="#enquiry-form"
            className="inline-flex items-center gap-1.5 bg-brand-blue hover:bg-brand-sky text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <SendIcon />

            <span className="hidden xs:inline">
              Enquire Now
            </span>

            <span className="xs:hidden">
              Enquire
            </span>
          </a>

        </div>
      </div>
    </header>
  );
}


/* =========================
   Logo
========================= */

function LogoMark() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 30c8 4 16 4 24-2 6-4.5 10-10 12-16-6 1-11 4-16 9-6 6-13 8-20 9z"
        fill="#F7C948"
      />

      <path
        d="M4 22c9 2 17-1 23-8 4.5-5 7-11 8-17-7 2-13 6-18 12-6 7-9 15-13 13z"
        fill="#123B6B"
      />
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
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.65-.62-2.9-1.25-4.8-4.16-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.11.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.29.29-.12.57.16.27.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.18.7-.81.89-1.09.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}


/* =========================
   Send Icon
========================= */

function SendIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  );
}