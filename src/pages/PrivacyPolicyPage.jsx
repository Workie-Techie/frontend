import { Link } from "react-router-dom";

const sections = [
  {
    title: "Information we collect",
    body:
      "We collect account details, contact information, role selection, expertise categories, specializations, onboarding answers, client project intake details, portfolio content, uploaded media, messages, payment records, payout details, bank verification responses, support notes, and waitlist information. We may also collect basic technical information such as device, browser, IP address, and usage events needed to secure and improve the platform.",
  },
  {
    title: "How we use information",
    body:
      "We use information to create and secure accounts, guide client requests, assess professional fit, support matching, operate assignments, display approved portfolio information, verify bank details through payment partners, record manual or Paystack-related payment activity, resolve disputes, send service updates, prevent misuse, improve the product, and comply with legal or regulatory obligations.",
  },
  {
    title: "How information is shared",
    body:
      "We share information only where needed to run WorkieTechie: with staff and administrators, with matched clients or professionals where relevant to a request or assignment, with payment and verification providers such as Paystack, with hosting, analytics, email, storage, and support providers, or where required for safety, legal compliance, fraud prevention, or dispute resolution. We do not sell personal information.",
  },
  {
    title: "Portfolio and browse visibility",
    body:
      "Professional profiles and portfolio items are private by default. WorkieTechie may make selected profile snippets or portfolio items visible only when approved through platform controls. Private share links and browse-visible cards should contain only information suitable for client review.",
  },
  {
    title: "Payments and bank verification",
    body:
      "Professionals may provide Nigerian bank account details for verification and payout readiness. Clients may provide payment references or evidence. Payment and bank data is used for account resolution, payment reconciliation, payout records, fraud prevention, and operational support.",
  },
  {
    title: "Retention, security, and your choices",
    body:
      "We keep information for as long as needed for account operations, assignments, payment records, dispute history, legal requirements, and legitimate business needs. We use reasonable administrative, technical, and access-control safeguards. You may request access, correction, deletion, or restriction of your information, subject to records we must keep for lawful, payment, security, or dispute reasons.",
  },
];

const PrivacyPolicyPage = () => (
  <main className="bg-[#fffaf0] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[36px] bg-gradient-to-br from-workie-blue to-workie-blue-light p-8 text-white shadow-[0_24px_80px_rgba(21,75,108,0.18)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-workie-gold">Legal</p>
        <h1 className="shell-title mt-3 text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-slate-100">Last updated: June 22, 2026</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-100">
          This policy explains how WorkieTechie collects, uses, shares, and protects information while operating a vetted matching platform for clients and professionals.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="shell-title text-2xl font-bold text-slate-950">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-[28px] border border-workie-gold/30 bg-amber-50 p-6">
        <h2 className="font-bold text-slate-950">Contact and requests</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          To ask a privacy question or make a data request, contact the WorkieTechie team through the platform support channels or the official contact details provided on the website.
        </p>
        <Link to="/terms" className="mt-4 inline-flex rounded-full bg-workie-blue px-5 py-3 text-sm font-bold text-white">
          Read Terms & Conditions
        </Link>
      </div>
    </div>
  </main>
);

export default PrivacyPolicyPage;
