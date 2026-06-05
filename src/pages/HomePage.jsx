import { useEffect, useMemo, useState } from "react";
import {
  HiOutlineArrowRight,
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckBadge,
  HiOutlineClipboardDocumentCheck,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

import landingClientCutout from "../assets/landing/landing-client-cutout.webp";
import landingHeroCutout from "../assets/landing/landing-hero-cutout.webp";
import landingProfessionalCutout from "../assets/landing/landing-professional-cutout.webp";
import profileService from "../services/profileService";

const audienceContent = {
  clients: {
    label: "Clients",
    eyebrow: "Vetted talent. Guided delivery.",
    heroTitle: "Get matched with vetted professionals without the marketplace noise.",
    heroBody:
      "WorkieTechie helps clients turn project ideas into clear briefs, then connects them with capable professionals through a process built for quality, accountability, communication, and satisfaction.",
    primaryCta: "Start your request",
    secondaryCta: "See how it works",
    heroImage: landingHeroCutout,
    heroAlt: "Nigerian professional ready for curated client work",
    stats: [
      ["Vetted", "professionals reviewed before client work"],
      ["Guided", "requests shaped with the right project details"],
      ["Tracked", "delivery, feedback, approvals, and disputes in one place"],
    ],
    flow: ["Brief received", "Professional selected", "Delivery in review"],
    processTitle: "From first brief to final approval, every step has a place.",
    processBody:
      "WorkieTechie keeps client work moving through simple, visible stages. Users do not need to guess what happens next or where to send feedback.",
    steps: [
      {
        title: "Tell us what you need",
        body: "Submit a simple but detailed request with general project questions and skill-specific details.",
      },
      {
        title: "We review the fit",
        body: "The WorkieTechie team checks the brief, clarifies gaps, and prepares the right professional match.",
      },
      {
        title: "The professional accepts",
        body: "A selected professional reviews the assignment and confirms whether the work is a fit.",
      },
      {
        title: "Delivery is tracked",
        body: "Work moves through visible states: in progress, submitted, feedback, approval, dispute if needed, and completion.",
      },
    ],
    audienceTitle: "A calmer way for clients to get professional work done.",
    audienceBody:
      "Submit a guided project request, get clearer expectations from the start, and follow delivery through matching, payment, review, approval, or support when something needs attention.",
    activeCardTitle: "Submit a project request and let the process guide the match.",
    activeCardBody:
      "Clients describe what they need, choose the right service area, answer helpful questions, and follow the request as it moves through review, payment, matching, delivery, and approval.",
    activeBenefits: [
      "Submit one guided brief instead of searching through hundreds of profiles.",
      "See approved portfolio signals where browsing is enabled by WorkieTechie.",
      "Track assignments, payments, approvals, special requests, and disputes from your dashboard.",
    ],
    activeImage: landingClientCutout,
    activeVariant: "client",
    activeLabel: "For clients",
  },
  professionals: {
    label: "Professionals",
    eyebrow: "Quality work. Better-fit opportunities.",
    heroTitle: "Build a trusted profile and stay ready for work that fits your skill.",
    heroBody:
      "WorkieTechie helps serious professionals present their expertise, portfolio proof, payout details, and delivery readiness so they can be considered for better-matched client work.",
    primaryCta: "Join as a professional",
    secondaryCta: "See the professional flow",
    heroImage: landingProfessionalCutout,
    heroAlt: "Nigerian professional preparing portfolio work",
    stats: [
      ["Profile", "show your strongest expertise and proof"],
      ["Ready", "keep portfolio, payout, and availability organized"],
      ["Matched", "receive assignment offers that fit your skill"],
    ],
    flow: ["Profile completed", "Assignment offer", "Submit for review"],
    processTitle: "From profile setup to reviewed delivery, every step stays organized.",
    processBody:
      "WorkieTechie gives professionals a clear route from onboarding to assignment response, submission, review notes, and payout readiness.",
    steps: [
      {
        title: "Build your profile",
        body: "Choose your expertise, answer guided prompts, add portfolio proof, and keep your professional details current.",
      },
      {
        title: "Receive a matched offer",
        body: "When your skill fits a client request, you receive an assignment offer with expectations before accepting.",
      },
      {
        title: "Submit the work",
        body: "Send files, links, notes, or milestone submissions through the dashboard so delivery has a clear record.",
      },
      {
        title: "Follow review and payout",
        body: "See approval, change requests, disputes if needed, and payout records after confirmed completion.",
      },
    ],
    audienceTitle: "A stronger way for professionals to be considered for quality work.",
    audienceBody:
      "Create an assignment-ready profile, answer expertise-specific prompts, keep your portfolio updated, and respond to matched opportunities with a clear delivery process.",
    activeCardTitle: "Build a trusted profile and stay ready for better-fit work.",
    activeCardBody:
      "Professionals choose their expertise, answer onboarding prompts, add portfolio projects, verify payout details, and respond to assignment offers that match their strengths.",
    activeBenefits: [
      "Create an assignment-ready profile based on your strongest expertise.",
      "Keep your portfolio, bank details, messages, and opportunities organized.",
      "Accept the work that fits, submit files or links for review, and follow payout status.",
    ],
    activeImage: landingProfessionalCutout,
    activeVariant: "professional",
    activeLabel: "For professionals",
  },
};

const servicePills = ["Product design", "Web development", "Brand design", "Content", "Marketing", "Admin support"];

const featureCards = [
  {
    icon: HiOutlineClipboardDocumentCheck,
    title: "Clear project briefs",
    body: "Clients answer structured questions so the work starts with context, scope, budget signals, timeline, and success expectations.",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Vetted professional pool",
    body: "Professionals build profiles around their strongest skills, portfolio proof, availability, delivery history, and payout readiness.",
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "Managed communication",
    body: "Threads, files, links, status updates, and admin support keep everyone aligned before work starts and while delivery is being reviewed.",
  },
];

const operationalHighlights = [
  {
    icon: HiOutlineBriefcase,
    title: "Assignments",
    body: "Each assignment has clear status tracking, professional response, due dates, milestones, submissions, and review notes.",
  },
  {
    icon: HiOutlineBanknotes,
    title: "Payments",
    body: "Clients can submit payment references or evidence, while professionals verify Nigerian bank details for manual payouts.",
  },
  {
    icon: HiOutlineCheckBadge,
    title: "Approvals",
    body: "Clients can approve completed work, request changes, or raise a dispute when expectations need a formal review.",
  },
];

const faqs = [
  {
    question: "Is WorkieTechie like a bidding marketplace?",
    answer: "No. The goal is not to make clients sort through endless proposals. WorkieTechie uses a guided request process and a vetted professional pool so matches can be more thoughtful.",
  },
  {
    question: "Can clients browse professionals?",
    answer: "Yes, when WorkieTechie enables Browse Talent. Even then, only admin-approved profiles and portfolio items are shown, and clients are encouraged to submit a proper brief.",
  },
  {
    question: "How do professionals get projects?",
    answer: "Professionals complete their profiles, answer onboarding questions, add portfolio proof, and receive assignment offers when their expertise fits a client request.",
  },
  {
    question: "What happens if work needs changes?",
    answer: "The dashboard supports feedback, review notes, files, links, approval, change requests, and disputes so issues can be handled with a clear record.",
  },
];

const FloatingCard = ({ className = "", icon: Icon, title, body }) => (
  <div className={`absolute rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_70px_rgba(21,75,108,0.18)] backdrop-blur ${className}`}>
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-workie-blue text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs leading-5 text-slate-500">{body}</p>
      </div>
    </div>
  </div>
);

const SectionIntro = ({ eyebrow, title, body, centered = false }) => (
  <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    <p className="text-xs font-bold uppercase tracking-[0.22em] text-workie-gold">{eyebrow}</p>
    <h2 className="shell-title mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">{title}</h2>
    {body ? <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{body}</p> : null}
  </div>
);

const CutoutScene = ({ src, alt, variant = "client" }) => (
  <div className="relative mx-auto h-[360px] max-w-[420px] sm:h-[430px]">
    <div className={`absolute inset-x-8 bottom-8 h-64 rounded-[48%] ${variant === "client" ? "bg-workie-gold/25" : "bg-workie-blue/10"}`} />
    <div className={`absolute left-4 top-10 h-28 w-28 rounded-[34px] ${variant === "client" ? "bg-workie-blue/10" : "bg-workie-gold/20"} rotate-[-10deg]`} />
    <div className={`absolute right-4 top-2 h-20 w-20 rounded-full ${variant === "client" ? "bg-white" : "bg-workie-gold/25"} shadow-[0_18px_45px_rgba(15,23,42,0.08)]`} />
    <div className="absolute left-0 top-24 rounded-[24px] border border-white/80 bg-white/90 px-4 py-3 shadow-[0_20px_60px_rgba(21,75,108,0.14)] backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-workie-gold">{variant === "client" ? "Brief ready" : "Profile ready"}</p>
      <p className="mt-1 text-sm font-bold text-workie-blue">{variant === "client" ? "Clear scope" : "Vetted skill"}</p>
    </div>
    <div className="absolute bottom-12 right-0 rounded-[24px] border border-white/80 bg-white/90 px-4 py-3 shadow-[0_20px_60px_rgba(21,75,108,0.14)] backdrop-blur">
      <p className="text-sm font-bold text-slate-900">{variant === "client" ? "Matched support" : "Assignment fit"}</p>
      <p className="text-xs text-slate-500">{variant === "client" ? "Guided next steps" : "Organized delivery"}</p>
    </div>
    <img src={src} alt={alt} className="absolute bottom-0 left-1/2 z-10 h-[350px] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_28px_35px_rgba(21,75,108,0.22)] sm:h-[430px]" loading="lazy" />
  </div>
);

const AudienceCard = ({ src, alt, label, title, body, variant, children }) => (
  <article className="group rounded-[38px] border border-white/80 bg-white/75 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(21,75,108,0.14)] sm:p-8">
    <CutoutScene src={src} alt={alt} variant={variant} />
    <div className="mt-4">
      <span className="rounded-full bg-workie-gold/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-workie-blue">
        {label}
      </span>
      <h3 className="shell-title text-2xl font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{body}</p>
      {children}
    </div>
  </article>
);

const ProcessVisual = () => (
  <div className="relative mx-auto min-h-[560px] max-w-[560px] overflow-hidden rounded-[46px] bg-gradient-to-br from-white via-[#fff7de] to-workie-blue/10 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.1)]">
    <div className="absolute -left-16 top-16 h-52 w-52 rounded-full bg-workie-gold/25" />
    <div className="absolute right-6 top-10 h-28 w-28 rounded-[36px] bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)]" />
    <div className="absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-workie-blue/10" />
    <img src={landingProfessionalCutout} alt="Professional moving through a guided project workflow" className="absolute bottom-0 right-2 z-10 h-[500px] object-contain drop-shadow-[0_30px_42px_rgba(21,75,108,0.2)]" loading="lazy" />
    <div className="relative z-20 max-w-[330px] space-y-4 pt-6">
      {["Brief received", "Match reviewed", "Work submitted", "Client approval"].map((item, index) => (
        <div key={item} className="flex items-center gap-3 rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_55px_rgba(21,75,108,0.12)] backdrop-blur">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-workie-blue text-sm font-black text-white">{index + 1}</span>
          <div>
            <p className="text-sm font-bold text-slate-900">{item}</p>
            <p className="text-xs text-slate-500">{index === 3 ? "Ready to close" : "Tracked in dashboard"}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="absolute bottom-8 left-8 z-20 rounded-[26px] bg-workie-gold px-5 py-4 text-white shadow-[0_18px_50px_rgba(223,159,39,0.32)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em]">Visible status</p>
      <p className="mt-1 text-lg font-black">No guessing</p>
    </div>
  </div>
);

const QualityVisual = () => (
  <div className="relative mx-auto min-h-[560px] max-w-[600px] overflow-hidden rounded-[48px] bg-gradient-to-br from-workie-blue via-workie-blue-light to-[#0f7ba8] p-6 shadow-[0_30px_90px_rgba(21,75,108,0.22)]">
    <div className="absolute inset-8 rounded-[46px] bg-white/10" />
    <div className="absolute -left-12 top-16 h-56 w-56 rounded-full bg-white/10" />
    <div className="absolute right-8 top-8 h-28 w-28 rounded-[36px] bg-workie-gold/25" />
    <img src={landingClientCutout} alt="Client reviewing quality, approval, and communication signals" className="absolute bottom-0 right-5 z-10 h-[520px] object-contain drop-shadow-[0_32px_42px_rgba(0,0,0,0.28)]" loading="lazy" />
    <div className="relative z-20 max-w-[340px] space-y-4 pt-8">
      {[
        ["Scope", "Clear expectation before work starts"],
        ["Files", "Links and attachments stay visible"],
        ["Review", "Approve, request changes, or dispute"],
      ].map(([title, body]) => (
        <div key={title} className="rounded-[26px] border border-white/15 bg-white/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-workie-gold">{title}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-800">{body}</p>
        </div>
      ))}
    </div>
    <div className="absolute bottom-8 left-8 z-20 rounded-[28px] border border-white/20 bg-[#12354b]/90 px-5 py-4 text-white backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-workie-gold">Accountability</p>
      <p className="mt-1 text-lg font-black">Built into every job</p>
    </div>
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

  const content = audienceContent[audience];
  const oppositeContent = audienceContent[audience === "clients" ? "professionals" : "clients"];
  const heroTitle = blockMap[`${audience}_hero_title`]?.body || content.heroTitle;
  const heroBody = blockMap[`${audience}_hero_body`]?.body || content.heroBody;

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffaf0]">
      <main>
        <section className="relative isolate overflow-hidden bg-[#fff1c9] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 bottom-[-1px] h-40 rounded-t-[50%] bg-[#fffaf0]" />
          <div className="absolute -left-24 top-36 h-72 w-72 rounded-full bg-workie-gold/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-[560px] w-[560px] rounded-bl-[240px] bg-white/30" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:min-h-[760px] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="pt-4">
              <p className="inline-flex rounded-full border border-workie-gold/30 bg-white/60 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-workie-blue">
                {content.eyebrow}
              </p>
              <div className="mt-6 inline-flex rounded-full border border-white/80 bg-white/75 p-1 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                {Object.entries(audienceContent).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={audience === key}
                    onClick={() => setAudience(key)}
                    className={`rounded-full px-5 py-3 text-sm font-black transition ${
                      audience === key ? "bg-workie-blue !text-white shadow-[0_12px_28px_rgba(21,75,108,0.22)]" : "text-slate-600 hover:text-workie-blue"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <h1 className="shell-title mt-7 max-w-4xl text-[3.1rem] font-bold leading-[0.98] text-slate-950 sm:text-6xl lg:text-7xl">
                {heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-700">{heroBody}</p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-workie-blue px-8 py-4 text-base font-bold !text-white shadow-[0_18px_40px_rgba(21,75,108,0.25)] transition hover:-translate-y-0.5">
                  {content.primaryCta} <HiOutlineArrowRight className="h-5 w-5" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-workie-blue shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5">
                  {content.secondaryCta}
                </a>
              </div>
              <div className="mt-5 text-sm font-semibold text-slate-500">
                <button type="button" onClick={() => setAudience(audience === "clients" ? "professionals" : "clients")} className="text-workie-blue underline decoration-workie-gold/50 underline-offset-4">
                  Switch to {oppositeContent.label.toLowerCase()} view
                </button>
              </div>
              <div className="mt-11 grid gap-4 sm:grid-cols-3">
                {content.stats.map(([label, body]) => (
                  <div key={label} className="rounded-[26px] border border-white/70 bg-white/60 p-4 backdrop-blur">
                    <p className="text-2xl font-black text-workie-blue">{label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto min-h-[560px] w-full max-w-[620px] lg:min-h-[680px] lg:max-w-none">
              <div className="absolute left-10 top-16 h-[400px] w-[400px] rounded-[42%] bg-workie-gold/25 blur-[1px] sm:h-[520px] sm:w-[520px]" />
              <div className="absolute right-4 top-8 h-32 w-32 rounded-[40px] bg-white/70 shadow-[0_22px_60px_rgba(15,23,42,0.08)]" />
              <div className="absolute bottom-10 right-0 h-44 w-44 rounded-full bg-workie-blue/10" />
              <div className="absolute left-[48%] top-8 h-[500px] w-[390px] -translate-x-1/2 rounded-[46%] bg-white/35 sm:h-[630px] sm:w-[480px]" />
              <img src={content.heroImage} alt={content.heroAlt} className="absolute bottom-0 left-[48%] z-10 h-[500px] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_34px_42px_rgba(21,75,108,0.24)] sm:h-[620px]" fetchPriority="high" />
              <FloatingCard className="left-2 top-40 z-20 hidden w-[300px] sm:block" icon={HiOutlineUserGroup} title="Matched fit" body="Skills, portfolio, and scope reviewed together." />
              <FloatingCard className="bottom-24 right-0 z-20 hidden w-[330px] sm:block" icon={HiOutlineCheckBadge} title="Review-ready delivery" body="Files, links, feedback, and approvals stay visible." />
              <div className="absolute bottom-0 left-8 z-20 hidden w-[310px] rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur sm:block">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-workie-gold">Current flow</p>
                <div className="mt-4 space-y-3">
                  {content.flow.map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-workie-blue text-xs font-bold text-white">{index + 1}</span>
                      <span className="text-sm font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Built around high-demand digital work</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {servicePills.map((service) => (
                <span key={service} className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm">
                  {service}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              centered
              eyebrow="What WorkieTechie does"
              title="A calmer way to get professional work done."
              body="Instead of leaving clients and professionals to figure everything out alone, WorkieTechie creates a guided bridge. Clients bring the need. Professionals bring the skill. The platform keeps the process organized."
            />
            <div className="mt-20 grid gap-10 lg:grid-cols-3">
              {featureCards.map((card) => (
                <article key={card.title} className="relative rounded-[34px] border border-slate-100 bg-white p-8 pt-14 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
                  <span className="absolute -top-10 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-workie-blue text-white shadow-[0_18px_40px_rgba(21,75,108,0.22)]">
                    <card.icon className="h-9 w-9" />
                  </span>
                  <h3 className="shell-title text-center text-2xl font-bold text-slate-950">{card.title}</h3>
                  <p className="mt-4 text-center text-sm leading-7 text-slate-600">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              centered
              eyebrow="Two sides, one standard"
              title={content.audienceTitle}
              body={content.audienceBody}
            />
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <AudienceCard
                src={content.activeImage}
                alt={content.heroAlt}
                label={content.activeLabel}
                variant={content.activeVariant}
                title={content.activeCardTitle}
                body={content.activeCardBody}
              >
                <ul className="mt-5 space-y-3">
                  {content.activeBenefits.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <HiOutlineCheckBadge className="mt-0.5 h-5 w-5 shrink-0 text-workie-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AudienceCard>
              <AudienceCard
                src={oppositeContent.activeImage}
                alt={oppositeContent.heroAlt}
                label={`Also for ${oppositeContent.label.toLowerCase()}`}
                variant={oppositeContent.activeVariant}
                title={oppositeContent.activeCardTitle}
                body={oppositeContent.activeCardBody}
              >
                <ul className="mt-5 space-y-3">
                  {oppositeContent.activeBenefits.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <HiOutlineCheckBadge className="mt-0.5 h-5 w-5 shrink-0 text-workie-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </AudienceCard>
            </div>
          </div>
        </section>

        <section id="trust" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative">
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-3xl bg-workie-blue/10" />
              <div className="absolute -bottom-10 right-0 h-44 w-44 rounded-[40px] bg-workie-gold/20" />
              <ProcessVisual />
            </div>
            <div>
              <SectionIntro
                eyebrow="The process"
                title={content.processTitle}
                body={content.processBody}
              />
              <div className="mt-8 space-y-5">
                {content.steps.map((step, index) => (
                  <div key={step.title} className="flex gap-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-workie-gold text-lg font-black text-white">{index + 1}</span>
                    <div>
                      <h3 className="font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-slate-600">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              centered
              eyebrow="What happens inside"
              title="The dashboard is built around real project operations."
              body="The product supports the practical details that matter after signup: messages, files, links, assignments, payment records, review decisions, portfolio updates, and admin-guided support."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {operationalHighlights.map((item) => (
                <article key={item.title} className="rounded-[32px] bg-[#fffaf0] p-7">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-workie-blue text-white">
                    <item.icon className="h-7 w-7" />
                  </span>
                  <h3 className="shell-title mt-6 text-2xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-workie-gold">Quality and accountability</p>
              <h2 className="shell-title mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                Good work needs more than a profile match.
              </h2>
              <p className="mt-5 text-lg leading-9 text-slate-600">
                A client needs to know the work is being handled. A professional needs a clear expectation. The admin team needs enough structure to step in when payment, scope, files, approvals, or disputes require attention.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {["Admin-reviewed requests", "Private support threads", "File and link submissions", "Approval and dispute paths"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <QualityVisual />
          </div>
        </section>

        <section className="bg-[#12354b] px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-workie-gold">What users should feel</p>
              <h2 className="shell-title mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                Less confusion. More confidence. Better delivery.
              </h2>
              <p className="mt-5 text-lg leading-9 text-slate-200">
                WorkieTechie is built for people who want quality work without messy back-and-forth. The platform gives both sides a shared process, visible records, and support when something needs review.
              </p>
              <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-full bg-workie-gold px-7 py-4 text-sm font-bold !text-white">
                Create your account <HiOutlineArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="relative min-h-[580px]">
              <div className="absolute inset-x-8 bottom-20 h-[420px] rounded-[46%] bg-white/10" />
              <div className="absolute right-0 top-12 h-32 w-32 rounded-[38px] bg-workie-gold/20" />
              <img src={landingClientCutout} alt="Happy client after a successful project delivery" className="absolute bottom-4 left-1/2 h-[560px] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_34px_44px_rgba(0,0,0,0.26)]" loading="lazy" />
              <div className="absolute -bottom-8 left-6 right-6 rounded-[30px] border border-white/15 bg-white p-6 text-slate-800 shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
                <p className="text-lg font-semibold leading-8">
                  “The best part is knowing the work has a process. I can see what has been submitted, give feedback, and move to approval without chasing everyone.”
                </p>
                <p className="mt-4 text-sm font-bold text-workie-blue">Typical client experience WorkieTechie is designed for</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              centered
              eyebrow="Simple answers"
              title="A few things to know before you start."
              body="WorkieTechie is intentionally structured. The point is not just to list talent, but to help the right work reach the right professional and stay accountable until completion."
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {faqs.map((item) => (
                <article key={item.question} className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[42px] bg-gradient-to-br from-workie-gold via-[#f4bd54] to-[#ffe3a6] p-8 text-[#12354b] shadow-[0_30px_90px_rgba(223,159,39,0.22)] sm:p-12 lg:p-16">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em]">Ready when you are</p>
                <h2 className="shell-title mt-4 text-4xl font-bold leading-tight sm:text-5xl">Start with a clear request or a strong professional profile.</h2>
                <p className="mt-5 max-w-3xl text-base leading-8">
                  Clients can submit a guided project request. Professionals can join the talent pool, add portfolio proof, and stay ready for assignment offers that fit their expertise.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/register" className="rounded-full bg-workie-blue px-8 py-4 text-center text-sm font-bold !text-white">
                  Get started
                </Link>
                <Link to="/login" className="rounded-full bg-white/80 px-8 py-4 text-center text-sm font-bold text-workie-blue">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
