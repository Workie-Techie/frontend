import { Link } from "react-router-dom";

import logoImage from "../assets/logo2.png";

const footerLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Join waitlist", to: "/waitlist" },
  { label: "Login", to: "/login" },
];

const PublicFooter = () => (
  <footer className="bg-[#fffaf0] px-4 pb-8 pt-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl rounded-[32px] border border-white/80 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center" aria-label="WorkieTechie home">
            <img src={logoImage} alt="WorkieTechie" className="h-12 w-auto" />
          </Link>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            A vetted bridge for clients and professionals, built around clearer briefs, accountable delivery, payments, approvals, and support.
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm font-semibold">
          {footerLinks.map((link) => (
            <Link key={link.to} to={link.to} className="rounded-full bg-slate-50 px-4 py-2 text-slate-600 transition hover:bg-workie-blue hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-6 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500">
        <p>&copy; {new Date().getFullYear()} WorkieTechie. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
