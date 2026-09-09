const BENEFITS = [
  {
    title: "Customized Trips",
    description: "Tailor-made trips as per your needs and interests.",
    icon: PalmIcon,
  },
  {
    title: "Best Deals",
    description: "Affordable packages for every budget.",
    icon: TagIcon,
  },
  {
    title: "Expert Guidance",
    description: "Our travel experts are always here to help.",
    icon: UserIcon,
  },
  {
    title: "Hassle-Free Travel",
    description: "We take care of the details, so you can enjoy the journey.",
    icon: ShieldIcon,
  },
];

export default function Benefits() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {BENEFITS.map(({ title, description, icon: Icon }) => (
          <div key={title} className="flex flex-col items-center text-center gap-3">
            <span className="w-14 h-14 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <Icon />
            </span>
            <p className="font-display font-semibold text-brand-navy">{title}</p>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PalmIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c1 2 .5 4-1 5 2-1 4.5-.5 6 1.5-2.5-.5-4.5.5-5.5 2 2-.5 4 0 5.5 1.5-2.5 0-4.5 1-5.5 2.5V22h-2v-7c-1-1.5-3-2.5-5.5-2.5C5 11 7 10.5 9 11c-1-1.5-3-2.5-5.5-2 1.5-2 4-2.5 6-1.5-1.5-1-2-3-1-5 .5 1.5 1.5 2.5 3 3-1-1.5-1-3.5.5-5.5.5 2 1.5 3.5 0 5.5 1.5-.5 2.5-1.5 3-3Z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.82 0l7-7a2 2 0 0 0 0-2.84ZM6.5 8A1.5 1.5 0 1 1 8 6.5 1.5 1.5 0 0 1 6.5 8Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 4 5v6c0 5.25 3.4 10.16 8 11.5 4.6-1.34 8-6.25 8-11.5V5Zm-1.2 13.6-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4Z" />
    </svg>
  );
}
