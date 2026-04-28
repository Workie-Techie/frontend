import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import logoImage from "../assets/logo2.png";
import profileService from "../services/profileService";

const audienceContent = {
  clients: {
    eyebrow: "For clients",
    title: "A polished, admin-managed way to source premium Nigerian talent.",
    body: "Submit one structured request, get matched by the WorkieTechie team, approve with confidence, and keep every delivery conversation in one premium client portal.",
    ctaPrimary: { label: "Start a project request", to: "/register" },
    ctaSecondary: { label: "Login as a client", to: "/login" },
    pillars: [
      "Structured intake with admin-configured project questions",
      "Private portfolio links shared only when relevant",
      "Payment tracking, approvals, and dispute support in one place",
    ],
    process: [
      "Submit your brief with category-specific details",
      "WorkieTechie qualifies the request and aligns payment steps",
      "Admins match the right professional and manage delivery",
    ],
    proof: "Built for founders, teams, and operators who want premium output without a chaotic marketplace experience.",
  },
  professionals: {
    eyebrow: "For professionals",
    title: "Build a standout profile and get matched to the right client work.",
    body: "WorkieTechie is not another noisy job board. You create a premium profile, answer skill-specific intake questions, stay assignment-ready, and collaborate through a structured admin-led workflow.",
    ctaPrimary: { label: "Join as a professional", to: "/register" },
    ctaSecondary: { label: "Login to your hub", to: "/login" },
    pillars: [
      "Primary expertise and specialization-based onboarding",
      "Assignment inbox with accept or decline workflow",
      "Portfolio, payout details, and admin messaging in one dashboard",
    ],
    process: [
      "Complete your profile and expertise-led onboarding",
      "Stay visible to the admin matching team",
      "Receive assignments, manage delivery updates, and get paid manually after completion",
    ],
    proof: "Built for serious Nigerian professionals who want quality visibility, better-fit projects, and a more curated operating model.",
  },
};

const sectionCards = [
  {
    title: "Admin-configured workflows",
    text: "Categories, specializations, intake questions, and key operational settings are designed to live in the admin surface so product adjustments do not always require development work.",
  },
  {
    title: "Private talent pool architecture",
    text: "Professional portfolio pages still exist, but they are unlisted and intended for admin-mediated sharing with clients instead of public directory browsing.",
  },
  {
    title: "MVP-friendly communication",
    text: "Threaded inboxes and status history keep clients and professionals aligned with the admin team without requiring a costly realtime stack.",
  },
];

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
      <header className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/80 bg-white/85 px-5 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImage} alt="WorkieTechie" className="h-11 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-semibold text-workie-blue sm:inline-flex">
              Login
            </Link>
            <Link to="/register" className="rounded-full bg-workie-gold px-4 py-2 text-sm font-semibold text-white">
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="shell-card overflow-hidden p-8 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex rounded-full bg-slate-100 p-1">
                  {[
                    { id: "clients", label: "Clients" },
                    { id: "professionals", label: "Professionals" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAudience(tab.id)}
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                        audience === tab.id
                          ? "bg-workie-blue text-white shadow-lg"
                          : "text-slate-600 hover:text-workie-blue"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-workie-gold">
                  {content.eyebrow}
                </p>
                <h1 className="shell-title mt-4 max-w-3xl text-5xl font-bold leading-[1.02] text-slate-950 sm:text-6xl">
                  {heroTitle}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  {heroBody}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={content.ctaPrimary.to} className="rounded-full bg-workie-gold px-5 py-3.5 text-sm font-semibold text-white shadow-lg">
                    {content.ctaPrimary.label}
                  </Link>
                  <Link to={content.ctaSecondary.to} className="rounded-full border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700">
                    {content.ctaSecondary.label}
                  </Link>
                </div>
              </div>

              <div className="rounded-[30px] bg-gradient-to-br from-[#12354b] via-workie-blue to-workie-blue-light p-8 text-white shadow-[0_30px_100px_rgba(21,75,108,0.25)]">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">Why this flow works</p>
                <div className="mt-6 space-y-4">
                  {content.pillars.map((pillar) => (
                    <div key={pillar} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-slate-100 backdrop-blur">
                      {pillar}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-3xl border border-white/10 bg-black/10 p-5 text-sm leading-6 text-slate-100">
                  {proofBody}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {sectionCards.map((card) => (
              <article key={card.title} className="shell-panel p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-gold">Foundation</p>
                <h2 className="shell-title mt-3 text-2xl font-bold text-slate-900">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.text}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="shell-panel p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-workie-blue">How it works</p>
              <h2 className="shell-title mt-2 text-3xl font-bold text-slate-900">A curated operational model, not a crowded marketplace.</h2>
              <div className="mt-6 space-y-4">
                {content.process.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-workie-blue text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="shell-card bg-gradient-to-br from-workie-gold via-[#f0b548] to-[#f7cf88] p-8 text-[#183b56] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em]">Designed for an MVP with discipline</p>
              <h2 className="shell-title mt-3 text-4xl font-bold leading-tight">
                Premium UX now, with a future path to a broader marketplace later.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7">
                WorkieTechie's current product focus is admin-led matching, structured project intake, private portfolio sharing, and clean communication. That foundation keeps the product operationally strong today while leaving room for future self-serve discovery and marketplace features.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register" className="rounded-full bg-workie-blue px-5 py-3 text-sm font-semibold text-white">
                  Start now
                </Link>
                <Link to="/login" className="rounded-full border border-[#183b56]/20 px-5 py-3 text-sm font-semibold text-[#183b56]">
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
