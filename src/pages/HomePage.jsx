import { useMemo, useState } from "react";
import { useEffect } from "react";
import { HiOutlineChatBubbleLeftRight, HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi2";
import { Link } from "react-router-dom";

import profileService from "../services/profileService";

const audienceContent = {
  clients: {
    eyebrow: "For clients",
    title: "Find vetted professionals with a process built for quality delivery.",
    body: "Submit a clear request, get matched with the right professional, track progress with confidence, and complete work through a process designed for accountability and satisfaction.",
    ctaPrimary: { label: "Start a project request", to: "/register" },
    ctaSecondary: { label: "Login as a client", to: "/login" },
    pillars: [
      "Structured intake that captures the details needed for a strong match",
      "Vetted professional profiles and portfolio signals before work begins",
      "Progress tracking, approvals, and support when expectations need alignment",
    ],
    process: [
      "Submit your brief with category-specific details",
      "WorkieTechie reviews the request and prepares the right match",
      "Delivery moves through clear communication, feedback, and approval steps",
    ],
    proof: "Built for founders, teams, and operators who want dependable professionals, clearer accountability, and less risk than a chaotic marketplace.",
  },
  professionals: {
    eyebrow: "For professionals",
    title: "Build a trusted profile and get considered for better-fit client work.",
    body: "WorkieTechie helps serious professionals present their expertise clearly, stay ready for quality opportunities, and deliver through a process that protects standards on both sides.",
    ctaPrimary: { label: "Join as a professional", to: "/register" },
    ctaSecondary: { label: "Login to your hub", to: "/login" },
    pillars: [
      "Primary expertise and specialization-based onboarding",
      "Assignment inbox with clear accept or decline workflow",
      "Portfolio, payout details, and project communication in one dashboard",
    ],
    process: [
      "Complete your profile and expertise-led onboarding",
      "Stay visible for vetted matching opportunities",
      "Receive assignments, manage delivery updates, and get paid after confirmed completion",
    ],
    proof: "Built for serious Nigerian professionals who want quality visibility, better-fit projects, and a delivery process that values accountability.",
  },
};

const sectionCards = [
  {
    title: "Vetted intake and matching",
    text: "Service categories, specializations, and intake questions help WorkieTechie understand the work before matching clients with professionals.",
    icon: HiOutlineShieldCheck,
  },
  {
    title: "Quality-first talent visibility",
    text: "Professional portfolios can be reviewed through controlled visibility, so clients see relevant proof without turning the platform into a noisy directory.",
    icon: HiOutlineSparkles,
  },
  {
    title: "Accountable communication",
    text: "Threaded messages, status history, approvals, and dispute paths keep expectations clear from request to completion.",
    icon: HiOutlineChatBubbleLeftRight,
  },
];

const illustrationCopy = {
  clients: {
    label: "Client brief",
    main: "Project request",
    left: "Clear scope",
    right: "Matched talent",
    footer: "Track, approve, complete",
  },
  professionals: {
    label: "Professional profile",
    main: "Portfolio ready",
    left: "Verified skills",
    right: "Quality offers",
    footer: "Accept, deliver, get paid",
  },
};

const HeroIllustration = ({ audience }) => {
  const copy = illustrationCopy[audience];

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-workie-gold/30 blur-2xl" />
      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="relative rounded-[22px] border border-white/15 bg-[#08283d]/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-workie-gold">{copy.label}</p>
            <h3 className="shell-title mt-1 text-2xl font-bold text-white">{copy.main}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-workie-gold text-lg font-black text-white shadow-lg">
            WT
          </div>
        </div>

        <svg className="mt-5 h-52 w-full" viewBox="0 0 520 250" role="img" aria-label="WorkieTechie matching illustration">
          <defs>
            <linearGradient id="heroGold" x1="0" x2="1">
              <stop offset="0%" stopColor="#DF9F27" />
              <stop offset="100%" stopColor="#F7CF88" />
            </linearGradient>
            <linearGradient id="heroBlue" x1="0" x2="1">
              <stop offset="0%" stopColor="#16629E" />
              <stop offset="100%" stopColor="#154B6C" />
            </linearGradient>
          </defs>
          <path d="M86 128 C142 54, 230 56, 286 125 S398 203, 452 123" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="18" strokeLinecap="round" />
          <path d="M86 128 C142 54, 230 56, 286 125 S398 203, 452 123" fill="none" stroke="url(#heroGold)" strokeWidth="5" strokeDasharray="12 14" strokeLinecap="round">
            <animate attributeName="stroke-dashoffset" values="0;-52" dur="4s" repeatCount="indefinite" />
          </path>
          <g>
            <rect x="26" y="66" width="142" height="112" rx="26" fill="white" fillOpacity="0.95" />
            <circle cx="70" cy="105" r="22" fill="url(#heroBlue)" />
            <rect x="98" y="90" width="46" height="10" rx="5" fill="#154B6C" opacity="0.85" />
            <rect x="98" y="110" width="34" height="8" rx="4" fill="#64748B" opacity="0.6" />
            <rect x="52" y="142" width="88" height="10" rx="5" fill="#DF9F27" opacity="0.85" />
          </g>
          <g>
            <rect x="190" y="36" width="142" height="156" rx="30" fill="#FFFFFF" fillOpacity="0.98" />
            <rect x="220" y="66" width="82" height="16" rx="8" fill="#154B6C" />
            <rect x="218" y="96" width="88" height="8" rx="4" fill="#CBD5E1" />
            <rect x="218" y="116" width="70" height="8" rx="4" fill="#CBD5E1" />
            <circle cx="238" cy="154" r="17" fill="#DF9F27" />
            <circle cx="282" cy="154" r="17" fill="#16629E" />
          </g>
          <g>
            <rect x="356" y="76" width="142" height="112" rx="26" fill="white" fillOpacity="0.95" />
            <circle cx="400" cy="114" r="22" fill="url(#heroGold)" />
            <path d="M391 114 l8 8 l16 -19" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="428" y="100" width="42" height="10" rx="5" fill="#154B6C" opacity="0.85" />
            <rect x="428" y="120" width="32" height="8" rx="4" fill="#64748B" opacity="0.6" />
            <rect x="382" y="154" width="88" height="10" rx="5" fill="#16629E" opacity="0.85" />
          </g>
        </svg>

        <div className="grid gap-3 sm:grid-cols-3">
          {[copy.left, copy.right, copy.footer].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProcessIllustration = () => (
  <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#eef6fb] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
    <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-workie-gold/15" />
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-workie-blue">Visual workflow</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      {[
        ["Brief", "Structured answers"],
        ["Match", "Vetted fit"],
        ["Deliver", "Visible progress"],
      ].map(([title, body], index) => (
        <div key={title} className="group relative rounded-3xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-workie-gold">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-workie-blue text-lg font-black text-white">
            {index + 1}
          </div>
          <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{body}</p>
          {index < 2 ? (
            <div className="pointer-events-none absolute -right-5 top-9 hidden h-1 w-10 rounded-full bg-workie-gold sm:block" />
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

const TrustIllustration = () => (
  <div className="mt-7 rounded-[28px] border border-[#183b56]/10 bg-white/50 p-4 backdrop-blur">
    <svg className="h-44 w-full" viewBox="0 0 620 220" role="img" aria-label="Approval and satisfaction illustration">
      <defs>
        <linearGradient id="trustBlue" x1="0" x2="1">
          <stop offset="0%" stopColor="#154B6C" />
          <stop offset="100%" stopColor="#16629E" />
        </linearGradient>
      </defs>
      <rect x="30" y="28" width="220" height="150" rx="30" fill="white" opacity="0.9" />
      <rect x="65" y="64" width="118" height="14" rx="7" fill="#154B6C" />
      <rect x="65" y="96" width="150" height="10" rx="5" fill="#94A3B8" opacity="0.55" />
      <rect x="65" y="120" width="120" height="10" rx="5" fill="#94A3B8" opacity="0.45" />
      <circle cx="206" cy="67" r="22" fill="#DF9F27" />
      <path d="M197 67 l8 8 l16 -19" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M260 104 C320 48, 382 48, 438 104" fill="none" stroke="#154B6C" strokeWidth="9" strokeLinecap="round" opacity="0.18" />
      <path d="M260 104 C320 48, 382 48, 438 104" fill="none" stroke="#154B6C" strokeWidth="4" strokeDasharray="10 12" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" values="0;-44" dur="5s" repeatCount="indefinite" />
      </path>

      <rect x="390" y="42" width="200" height="136" rx="30" fill="url(#trustBlue)" />
      <circle cx="442" cy="90" r="24" fill="#F7CF88" />
      <rect x="482" y="76" width="68" height="12" rx="6" fill="white" opacity="0.95" />
      <rect x="482" y="102" width="48" height="9" rx="4.5" fill="white" opacity="0.65" />
      <rect x="430" y="132" width="118" height="14" rx="7" fill="#DF9F27" />
    </svg>
  </div>
);

const HomePage = () => {
  const [audience, setAudience] = useState("clients");
  const [contentBlocks, setContentBlocks] = useState([]);

  useEffect(() => {
    profileService.getLandingContent().then(setContentBlocks).catch(() => setContentBlocks([]));
  }, []);

  const blockMap = useMemo(
    () =>
      contentBlocks.reduce((accumulator, block) => {
        accumulator[block.key] = block;
        return accumulator;
      }, {}),
    [contentBlocks]
  );

  const content = useMemo(() => audienceContent[audience], [audience]);
  const heroTitle = blockMap[`${audience}_hero_title`]?.body || content.title;
  const heroBody = blockMap[`${audience}_hero_body`]?.body || content.body;
  const proofBody = blockMap[`${audience}_proof`]?.body || content.proof;

  return (
    <div className="min-h-screen">
      <main className="px-3 pb-12 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          <section id="clients" className="shell-card scroll-mt-28 overflow-hidden p-4 sm:p-8 lg:p-12">
            <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="min-w-0">
                <div className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1 sm:inline-flex sm:w-auto">
                  {[
                    { id: "clients", label: "Clients" },
                    { id: "professionals", label: "Professionals" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAudience(tab.id)}
                      className={`rounded-full px-3 py-2.5 text-xs font-semibold transition sm:px-5 sm:py-3 sm:text-sm ${
                        audience === tab.id
                          ? "bg-workie-blue text-white shadow-lg"
                          : "text-slate-600 hover:text-workie-blue"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-workie-gold sm:mt-8 sm:text-xs sm:tracking-[0.25em]">
                  {content.eyebrow}
                </p>
                <h1 className="shell-title mt-3 max-w-3xl break-words text-[2.35rem] font-bold leading-[1.04] text-slate-950 min-[390px]:text-[2.65rem] sm:mt-4 sm:text-6xl sm:leading-[1.02]">
                  {heroTitle}
                </h1>
                <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                  {heroBody}
                </p>

                <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                  <Link to={content.ctaPrimary.to} className="rounded-full bg-workie-gold px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg">
                    {content.ctaPrimary.label}
                  </Link>
                  <Link to={content.ctaSecondary.to} className="rounded-full border border-slate-200 px-5 py-3.5 text-center text-sm font-semibold text-slate-700">
                    {content.ctaSecondary.label}
                  </Link>
                </div>
              </div>

              <div className="min-w-0 rounded-[24px] bg-gradient-to-br from-[#12354b] via-workie-blue to-workie-blue-light p-4 text-white shadow-[0_30px_100px_rgba(21,75,108,0.25)] sm:rounded-[30px] sm:p-8">
                <HeroIllustration audience={audience} />
                <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-200 sm:text-xs sm:tracking-[0.25em]">Why this flow works</p>
                <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                  {content.pillars.map((pillar) => (
                    <div key={pillar} className="break-words rounded-2xl border border-white/10 bg-white/10 p-3 text-[0.86rem] leading-6 text-slate-100 backdrop-blur sm:rounded-3xl sm:p-4 sm:text-sm">
                      {pillar}
                    </div>
                  ))}
                </div>
                <div className="mt-4 break-words rounded-2xl border border-white/10 bg-black/10 p-4 text-[0.86rem] leading-6 text-slate-100 sm:mt-6 sm:rounded-3xl sm:p-5 sm:text-sm">
                  {proofBody}
                </div>
              </div>
            </div>
          </section>

          <section id="professionals" className="scroll-mt-28 grid gap-6 lg:grid-cols-3">
            {sectionCards.map((card) => (
              <article key={card.title} className="shell-panel group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-workie-gold sm:p-6">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-workie-gold/10 transition group-hover:scale-125" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-workie-gold/15 text-workie-gold ring-1 ring-workie-gold/20">
                  <card.icon className="h-6 w-6 transition group-hover:scale-110" aria-hidden="true" />
                </div>
                <h2 className="shell-title relative mt-3 text-[1.35rem] font-bold leading-tight text-slate-900 sm:text-2xl">{card.title}</h2>
                <p className="relative mt-3 text-sm leading-7 text-slate-600 sm:mt-4">{card.text}</p>
              </article>
            ))}
          </section>

          <section id="how-it-works" className="scroll-mt-28 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="shell-panel p-5 sm:p-8">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-workie-blue sm:text-xs sm:tracking-[0.2em]">How it works</p>
              <h2 className="shell-title mt-2 text-[1.8rem] font-bold leading-tight text-slate-900 sm:text-3xl">A guided matching process, not a crowded marketplace.</h2>
              <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                {content.process.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:gap-4 sm:rounded-3xl sm:p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-workie-blue text-sm font-bold text-white sm:h-10 sm:w-10">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <ProcessIllustration />
              </div>
            </div>

            <div id="trust" className="shell-card scroll-mt-28 bg-gradient-to-br from-workie-gold via-[#f0b548] to-[#f7cf88] p-5 text-[#183b56] sm:p-10">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.25em]">Built for trust on both sides</p>
              <h2 className="shell-title mt-3 break-words text-[2rem] font-bold leading-tight sm:text-4xl">
                Better matches, clearer expectations, and work both sides can stand behind.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 sm:mt-5">
                Clients get a calmer way to find dependable professionals. Professionals get a better way to be considered for work that fits their strengths. Everyone gets clearer communication, visible progress, and a process built around satisfaction before, during, and after delivery.
              </p>
              <TrustIllustration />
              <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                <Link to="/register" className="rounded-full bg-workie-blue px-5 py-3 text-center text-sm font-semibold text-white">
                  Start now
                </Link>
                <Link to="/login" className="rounded-full border border-[#183b56]/20 px-5 py-3 text-center text-sm font-semibold text-[#183b56]">
                  Return to your account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
