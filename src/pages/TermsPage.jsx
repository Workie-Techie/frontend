import { Link } from "react-router-dom";

const sections = [
  {
    title: "Using WorkieTechie",
    body:
      "WorkieTechie provides a curated platform for clients to submit project requests and for professionals to maintain assignment-ready profiles. You must provide accurate information, keep your account secure, and use the platform only for lawful, respectful, and work-related purposes.",
  },
  {
    title: "Matching and assignments",
    body:
      "WorkieTechie may review client requests, professional profiles, portfolio material, availability, and project requirements before facilitating a match. We do not guarantee that every client request will receive a match or that every professional will receive assignments. Assignment details, timelines, submissions, approvals, change requests, and disputes should be handled through the platform where available.",
  },
  {
    title: "Professional profiles and portfolio content",
    body:
      "Professionals are responsible for ensuring that portfolio content, links, media, and claims are accurate and that they have the rights to share them. WorkieTechie may approve, hide, feature, or remove profile or portfolio content from browse areas when needed for quality, safety, clarity, or platform operations.",
  },
  {
    title: "Payments, payouts, and refunds",
    body:
      "Client payments may be handled through Paystack-supported records or manual bank-transfer verification. Professional payouts may be recorded manually after confirmed work completion. Refunds, disputes, and payment reversals are reviewed based on project context, payment evidence, delivery records, and applicable platform decisions.",
  },
  {
    title: "Communication and conduct",
    body:
      "Users must not harass others, misrepresent identity or skills, submit fraudulent payment evidence, upload harmful files, bypass platform workflows, misuse private share links, or attempt to gain unauthorized access. WorkieTechie may restrict, suspend, or terminate accounts that create safety, payment, quality, or legal risks.",
  },
  {
    title: "Intellectual property",
    body:
      "Users keep ownership of their pre-existing materials. Project deliverables, licensing, portfolio display rights, and handover expectations should be agreed through the relevant project or assignment context. WorkieTechie may use platform names, logos, interface elements, and content structure as part of operating and improving the service.",
  },
  {
    title: "Service changes and limitations",
    body:
      "WorkieTechie may update workflows, forms, dashboards, browsing availability, payment instructions, or platform features. The platform is provided with reasonable care, but availability, specific matches, business results, and uninterrupted service are not guaranteed.",
  },
];

const TermsPage = () => (
  <main className="bg-[#fffaf0] px-4 pb-16 pt-32 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[36px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-workie-gold">Legal</p>
        <h1 className="shell-title mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Terms & Conditions</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">Last updated: June 22, 2026</p>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          These terms explain the basic rules for using WorkieTechie as a client, professional, or staff-managed platform participant.
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

      <div className="mt-8 rounded-[28px] bg-workie-blue p-6 text-white">
        <h2 className="font-bold">Questions about these terms?</h2>
        <p className="mt-2 text-sm leading-7 text-slate-100">
          Contact WorkieTechie through the official support channels. If you do not agree with these terms, you should not use the platform.
        </p>
        <Link to="/privacy-policy" className="mt-4 inline-flex rounded-full bg-workie-gold px-5 py-3 text-sm font-bold text-white">
          Read Privacy Policy
        </Link>
      </div>
    </div>
  </main>
);

export default TermsPage;
